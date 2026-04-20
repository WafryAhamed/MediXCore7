package com.bchospital.modules.prescription;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.BusinessException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.blockchain.BlockchainService;
import com.bchospital.modules.prescription.dto.PrescriptionCreateRequest;
import com.bchospital.modules.prescription.dto.PrescriptionResponse;
import com.bchospital.modules.prescription.mapper.PrescriptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMapper mapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    private final BlockchainService blockchainService;
    // Missing Notification/Pharmacy Services for now, implementing stubs inline where appropriate

    @Transactional(readOnly = true)
    public PageResponse<PrescriptionResponse> getPrescriptions(int page, int size, String patientId, String doctorId, String status) {
        Specification<Prescription> spec = Specification.where(PrescriptionSpecification.fieldEq("patientId", patientId))
                .and(PrescriptionSpecification.fieldEq("doctorId", doctorId))
                .and(PrescriptionSpecification.fieldEq("status", status));
        Page<Prescription> res = prescriptionRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(res.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getById(String id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionCreateRequest request) {
        Prescription p = mapper.toEntity(request);
        p.setPrescriptionNumber(numberGenerator.nextPrescriptionNumber());
        p.setStatus("PENDING");
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        
        if (request.getItems() != null) {
            request.getItems().forEach(itemDto -> {
                PrescriptionItem item = mapper.toItemEntity(itemDto);
                item.setPrescription(p);
                p.getItems().add(item);
            });
        }
        
        Prescription saved = prescriptionRepository.save(p);
        auditService.log("CREATE_PRESCRIPTION", "Prescription", saved.getId(), null, "Doctor created prescription");
        blockchainService.registerPrescriptionHash(saved); // Stub 
        // notification pending
        return mapper.toResponse(saved);
    }

    @Transactional
    public void dispense(String id, String pharmacistId) {
        Prescription p = findById(id);
        if (!p.getStatus().equals("PENDING")) {
            throw new BusinessException("Only PENDING prescriptions can be dispensed");
        }
        // TODO: Call pharmacyService.deductStock(medicineId, quantity) here
        
        p.setStatus("DISPENSED");
        p.setDispensedAt(LocalDateTime.now());
        p.setDispensedById(pharmacistId);
        p.setUpdatedAt(LocalDateTime.now());
        prescriptionRepository.save(p);
        auditService.log("DISPENSE_PRESCRIPTION", "Prescription", id, null, "Pharmacist dispensed items");
    }

    @Transactional
    public void cancel(String id) {
        Prescription p = findById(id);
        if (!p.getStatus().equals("PENDING")) {
            throw new BusinessException("Cannot cancel a non-pending prescription");
        }
        p.setStatus("CANCELLED");
        p.setUpdatedAt(LocalDateTime.now());
        prescriptionRepository.save(p);
        auditService.log("CANCEL_PRESCRIPTION", "Prescription", id, null, "Doctor cancelled prescription");
    }
    
    public byte[] generatePdf(String id) {
        // use com.bchospital.common.util.PdfUtil
        return new byte[0];
    }

    private Prescription findById(String id) {
        return prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
}