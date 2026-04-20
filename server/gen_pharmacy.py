import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\pharmacy"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

medicine_entity = """package com.bchospital.modules.pharmacy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "generic_name")
    private String genericName;

    @Column(nullable = false)
    private String category;

    private String manufacturer;

    @Column(nullable = false)
    private String unit; // TABLET/CAPSULE/ML/MG

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(name = "reorder_level", nullable = false)
    @Builder.Default
    private int reorderLevel = 10;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "batch_number")
    private String batchNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(nullable = false)
    private String status; // ACTIVE/DISCONTINUED/EXPIRED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
"""

dispensing_entity = """package com.bchospital.modules.pharmacy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispensing_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DispensingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "medicine_id", nullable = false)
    private String medicineId;

    @Column(name = "prescription_id")
    private String prescriptionId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String type; // DISPENSE/RESTOCK/ADJUSTMENT

    private String reference;

    @Column(name = "dispensed_by_id", nullable = false)
    private String dispensedById;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
"""

repo = """package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String>, JpaSpecificationExecutor<Medicine> {
    List<Medicine> findByStockQuantityLessThanEqualAndStatus(int quantity, String status);
    List<Medicine> findByExpiryDateBetweenAndStatus(LocalDate now, LocalDate future, String status);
}
"""

dispensing_repo = """package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DispensingLogRepository extends JpaRepository<DispensingLog, String> {
}
"""

java_classes = {
    "dto/MedicineCreateRequest.java": """package com.bchospital.modules.pharmacy.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineCreateRequest {
    @NotBlank private String name;
    private String genericName;
    @NotBlank private String category;
    private String manufacturer;
    @NotBlank private String unit;
    private Integer stockQuantity;
    private Integer reorderLevel;
    @NotNull private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
}""",
    "dto/MedicineUpdateRequest.java": """package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineUpdateRequest {
    private String manufacturer;
    private Integer reorderLevel;
    private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
    private String status;
}""",
    "dto/RestockRequest.java": """package com.bchospital.modules.pharmacy.dto;
import jakarta.validation.constraints.Min;
import lombok.Data;
@Data
public class RestockRequest {
    @Min(1) private int quantity;
    private String reference;
}""",
    "dto/MedicineResponse.java": """package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineResponse {
    private String id;
    private String name;
    private String genericName;
    private String category;
    private String manufacturer;
    private String unit;
    private int stockQuantity;
    private int reorderLevel;
    private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
    private String status;
}""",
    "dto/DispensingLogResponse.java": """package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class DispensingLogResponse {
    private String id;
    private String medicineId;
    private String prescriptionId;
    private int quantity;
    private String type;
    private String reference;
    private String dispensedById;
    private LocalDateTime createdAt;
}""",
    "mapper/PharmacyMapper.java": """package com.bchospital.modules.pharmacy.mapper;
import com.bchospital.modules.pharmacy.Medicine;
import com.bchospital.modules.pharmacy.DispensingLog;
import com.bchospital.modules.pharmacy.dto.MedicineCreateRequest;
import com.bchospital.modules.pharmacy.dto.MedicineResponse;
import com.bchospital.modules.pharmacy.dto.MedicineUpdateRequest;
import com.bchospital.modules.pharmacy.dto.DispensingLogResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PharmacyMapper {
    Medicine toEntity(MedicineCreateRequest req);
    MedicineResponse toResponse(Medicine entity);
    void updateEntity(MedicineUpdateRequest req, @MappingTarget Medicine entity);
    DispensingLogResponse toLogResponse(DispensingLog log);
}""",
    "PharmacySpecification.java": """package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.domain.Specification;
public class PharmacySpecification {
    public static Specification<Medicine> statusEq(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}""",
    "PharmacyService.java": """package com.bchospital.modules.pharmacy;
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
}""",
    "PharmacyController.java": """package com.bchospital.modules.pharmacy;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.pharmacy.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pharmacy")
@RequiredArgsConstructor
@Tag(name = "Pharmacy")
public class PharmacyController {

    private final PharmacyService service;

    @GetMapping("/inventory")
    public ApiResponse<PageResponse<MedicineResponse>> getInventory(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String status, @RequestParam(required = false) Boolean lowStock) {
        return ApiResponse.success(service.getInventory(page, size, status, lowStock));
    }

    @GetMapping("/inventory/{id}")
    public ApiResponse<MedicineResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping("/inventory")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<MedicineResponse> create(@Valid @RequestBody MedicineCreateRequest request) {
        return ApiResponse.success(service.create(request));
    }

    @PutMapping("/inventory/{id}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<MedicineResponse> update(@PathVariable String id, @RequestBody MedicineUpdateRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @PostMapping("/inventory/{id}/restock")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<Void> restock(@PathVariable String id, @Valid @RequestBody RestockRequest request, Authentication auth) {
        service.restock(id, request, auth.getName());
        return ApiResponse.success(null, "Restocked");
    }

    @GetMapping("/dispensing-log")
    public ApiResponse<PageResponse<DispensingLogResponse>> getLogs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(service.getLogs(page, size));
    }

    @GetMapping("/alerts")
    public ApiResponse<Map<String, List<MedicineResponse>>> getAlerts() {
        return ApiResponse.success(Map.of(
            "lowStock", service.getLowStockAlerts(),
            "expiringSoon", service.getExpiryAlerts()
        ));
    }
}"""
}

with open(os.path.join(BASE_DIR, "Medicine.java"), "w") as f: f.write(medicine_entity)
with open(os.path.join(BASE_DIR, "DispensingLog.java"), "w") as f: f.write(dispensing_entity)
with open(os.path.join(BASE_DIR, "MedicineRepository.java"), "w") as f: f.write(repo)
with open(os.path.join(BASE_DIR, "DispensingLogRepository.java"), "w") as f: f.write(dispensing_repo)

for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)

