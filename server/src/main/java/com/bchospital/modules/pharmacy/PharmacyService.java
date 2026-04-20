package com.bchospital.modules.pharmacy;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.exception.BusinessException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.pharmacy.dto.*;
import com.bchospital.modules.pharmacy.mapper.PharmacyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyService {
    
    private final MedicineRepository medicineRepository;
    private final DispensingLogRepository logRepository;
    private final PharmacyMapper mapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public PageResponse<MedicineResponse> getInventory(int page, int size, String status, Boolean lowStock) {
        Specification<Medicine> spec = Specification.where(PharmacySpecification.statusEq(status));
        if (Boolean.TRUE.equals(lowStock)) {
            spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("stockQuantity"), r.get("reorderLevel")));
        }
        Page<Medicine> pageResult = medicineRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(pageResult.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public MedicineResponse getById(String id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public MedicineResponse create(MedicineCreateRequest req) {
        Medicine m = mapper.toEntity(req);
        m.setStatus("ACTIVE");
        m.setCreatedAt(LocalDateTime.now());
        m.setUpdatedAt(LocalDateTime.now());
        if(m.getStockQuantity() == 0 && req.getStockQuantity() == null) m.setStockQuantity(0);
        if(m.getReorderLevel() == 0 && req.getReorderLevel() == null) m.setReorderLevel(10);
        Medicine saved = medicineRepository.save(m);
        auditService.log("CREATE_MEDICINE", "Medicine", saved.getId(), null, "Created med");
        return mapper.toResponse(saved);
    }

    @Transactional
    public MedicineResponse update(String id, MedicineUpdateRequest req) {
        Medicine m = findById(id);
        mapper.updateEntity(req, m);
        m.setUpdatedAt(LocalDateTime.now());
        return mapper.toResponse(medicineRepository.save(m));
    }

    @Transactional
    public void restock(String id, RestockRequest req, String userId) {
        Medicine m = findById(id);
        m.setStockQuantity(m.getStockQuantity() + req.getQuantity());
        m.setUpdatedAt(LocalDateTime.now());
        medicineRepository.save(m);

        DispensingLog dl = DispensingLog.builder()
            .medicineId(m.getId())
            .quantity(req.getQuantity())
            .type("RESTOCK")
            .reference(req.getReference())
            .dispensedById(userId)
            .createdAt(LocalDateTime.now())
            .build();
        logRepository.save(dl);
        auditService.log("RESTOCK_MEDICINE", "Medicine", id, null, "Restocked " + req.getQuantity());
    }

    @Transactional(readOnly = true)
    public PageResponse<DispensingLogResponse> getLogs(int page, int size) {
        Page<DispensingLog> logs = logRepository.findAll(PageRequest.of(page, size));
        return PageResponse.from(logs.map(mapper::toLogResponse));
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getLowStockAlerts() {
        List<Medicine> m = medicineRepository.findByStockQuantityLessThanEqualAndStatus(10, "ACTIVE"); // 10 is default reorder, we can use filtering
        // Properly we should filter where stock <= reorderLevel. It's safe to do in Java stream for small datasets or custom JPQL.
        // Doing custom filter logic:
        return medicineRepository.findAll().stream()
            .filter(med -> med.getStatus().equals("ACTIVE") && med.getStockQuantity() <= med.getReorderLevel())
            .map(mapper::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getExpiryAlerts() {
        return medicineRepository.findByExpiryDateBetweenAndStatus(LocalDate.now(), LocalDate.now().plusDays(30), "ACTIVE")
               .stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    private Medicine findById(String id) {
        return medicineRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));
    }
}