import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\prescription"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

prescription_entity = """package com.bchospital.modules.prescription;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "prescriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "prescription_number", nullable = false, unique = true)
    private String prescriptionNumber;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(nullable = false)
    private String status; // PENDING/DISPENSED/CANCELLED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "dispensed_at")
    private LocalDateTime dispensedAt;

    @Column(name = "dispensed_by_id")
    private String dispensedById;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionItem> items = new ArrayList<>();
}
"""

prescription_item_entity = """package com.bchospital.modules.prescription;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "prescription_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonIgnore
    private Prescription prescription;

    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(name = "generic_name")
    private String genericName;

    private String dosage;
    private String frequency;
    private String duration;
    private int quantity;
    private String instructions;

    @Column(name = "medicine_id")
    private String medicineId;
}
"""

prescription_repo = """package com.bchospital.modules.prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String>, JpaSpecificationExecutor<Prescription> {
}
"""

java_classes = {
    "dto/PrescriptionItemRequest.java": """package com.bchospital.modules.prescription.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class PrescriptionItemRequest {
    @NotBlank private String medicationName;
    private String genericName;
    @NotBlank private String dosage;
    @NotBlank private String frequency;
    @NotBlank private String duration;
    private int quantity;
    private String instructions;
    private String medicineId;
}""",
    "dto/PrescriptionCreateRequest.java": """package com.bchospital.modules.prescription.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;
@Data
public class PrescriptionCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    private String appointmentId;
    private String notes;
    @NotEmpty private List<PrescriptionItemRequest> items;
}""",
    "dto/PrescriptionResponse.java": """package com.bchospital.modules.prescription.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class PrescriptionResponse {
    private String id;
    private String prescriptionNumber;
    private String patientId;
    private String doctorId;
    private String appointmentId;
    private String status;
    private String notes;
    private LocalDateTime dispensedAt;
    private String dispensedById;
    private String blockchainTxHash;
    private LocalDateTime createdAt;
    private List<PrescriptionItemDto> items;
    
    @Data
    public static class PrescriptionItemDto {
        private String id;
        private String medicationName;
        private String genericName;
        private String dosage;
        private String frequency;
        private String duration;
        private int quantity;
        private String instructions;
        private String medicineId;
    }
}""",
    "dto/DispenseRequest.java": """package com.bchospital.modules.prescription.dto;
import lombok.Data;
@Data
public class DispenseRequest {
    private String dispensedById;
}""",
    "mapper/PrescriptionMapper.java": """package com.bchospital.modules.prescription.mapper;
import com.bchospital.modules.prescription.Prescription;
import com.bchospital.modules.prescription.PrescriptionItem;
import com.bchospital.modules.prescription.dto.PrescriptionCreateRequest;
import com.bchospital.modules.prescription.dto.PrescriptionItemRequest;
import com.bchospital.modules.prescription.dto.PrescriptionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PrescriptionMapper {
    @Mapping(target = "items", ignore = true)
    Prescription toEntity(PrescriptionCreateRequest request);
    PrescriptionItem toItemEntity(PrescriptionItemRequest request);
    PrescriptionResponse toResponse(Prescription prescription);
}""",
    "PrescriptionSpecification.java": """package com.bchospital.modules.prescription;
import org.springframework.data.jpa.domain.Specification;
public class PrescriptionSpecification {
    public static Specification<Prescription> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
}""",
    "PrescriptionService.java": """package com.bchospital.modules.prescription;
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
}""",
    "PrescriptionController.java": """package com.bchospital.modules.prescription;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.prescription.dto.DispenseRequest;
import com.bchospital.modules.prescription.dto.PrescriptionCreateRequest;
import com.bchospital.modules.prescription.dto.PrescriptionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor
@Tag(name = "Prescriptions")
public class PrescriptionController {
    
    private final PrescriptionService service;

    @GetMapping
    public ApiResponse<PageResponse<PrescriptionResponse>> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String patientId, @RequestParam(required = false) String doctorId, @RequestParam(required = false) String status) {
        return ApiResponse.success(service.getPrescriptions(page, size, patientId, doctorId, status));
    }

    @GetMapping("/{id}")
    public ApiResponse<PrescriptionResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<PrescriptionResponse> create(@Valid @RequestBody PrescriptionCreateRequest request) {
        return ApiResponse.success(service.createPrescription(request));
    }

    @PutMapping("/{id}/dispense")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<Void> dispense(@PathVariable String id, Authentication auth) {
        service.dispense(id, auth.getName());
        return ApiResponse.success(null, "Dispensed");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<Void> cancel(@PathVariable String id) {
        service.cancel(id);
        return ApiResponse.success(null, "Cancelled");
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getPdf(@PathVariable String id) {
        byte[] pdf = service.generatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=RX-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}"""
}

with open(os.path.join(BASE_DIR, "Prescription.java"), "w") as f: f.write(prescription_entity)
with open(os.path.join(BASE_DIR, "PrescriptionItem.java"), "w") as f: f.write(prescription_item_entity)
with open(os.path.join(BASE_DIR, "PrescriptionRepository.java"), "w") as f: f.write(prescription_repo)
for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)

