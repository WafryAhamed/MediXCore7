import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\lab"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

lab_entity = """package com.bchospital.modules.lab;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "request_number", nullable = false, unique = true)
    private String requestNumber;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "test_category", nullable = false)
    private String testCategory;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String priority;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "results_json")
    private String resultsJson;

    @Column(name = "report_url")
    private String reportUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "completed_by_id")
    private String completedById;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
"""

repo = """package com.bchospital.modules.lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, String>, JpaSpecificationExecutor<LabRequest> {
}
"""

java_classes = {
    "dto/LabCreateRequest.java": """package com.bchospital.modules.lab.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LabCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    private String appointmentId;
    @NotBlank private String testName;
    @NotBlank private String testCategory;
    @NotBlank private String priority;
    private String notes;
}""",
    "dto/LabResultRequest.java": """package com.bchospital.modules.lab.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LabResultRequest {
    @NotBlank private String resultsJson;
}""",
    "dto/LabResponse.java": """package com.bchospital.modules.lab.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class LabResponse {
    private String id;
    private String requestNumber;
    private String patientId;
    private String doctorId;
    private String testName;
    private String testCategory;
    private String status;
    private String priority;
    private String resultsJson;
    private String reportUrl;
    private String notes;
    private LocalDateTime orderedAt;
    private LocalDateTime completedAt;
    private String completedById;
}""",
    "mapper/LabMapper.java": """package com.bchospital.modules.lab.mapper;
import com.bchospital.modules.lab.LabRequest;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LabMapper {
    LabRequest toEntity(LabCreateRequest request);
    LabResponse toResponse(LabRequest req);
}""",
    "LabSpecification.java": """package com.bchospital.modules.lab;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
public class LabSpecification {
    public static Specification<LabRequest> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
    public static Specification<LabRequest> dateAfter(LocalDateTime date) {
        return (root, query, cb) -> date == null ? null : cb.greaterThanOrEqualTo(root.get("orderedAt"), date);
    }
}""",
    "LabService.java": """package com.bchospital.modules.lab;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.blockchain.BlockchainService;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import com.bchospital.modules.lab.dto.LabResultRequest;
import com.bchospital.modules.lab.mapper.LabMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabRequestRepository repo;
    private final LabMapper mapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    private final BlockchainService blockchainService;

    @Transactional(readOnly = true)
    public PageResponse<LabResponse> getRequests(int page, int size, String status, String priority, LocalDateTime date) {
        Specification<LabRequest> spec = Specification.where(LabSpecification.fieldEq("status", status))
                .and(LabSpecification.fieldEq("priority", priority))
                .and(LabSpecification.dateAfter(date));
        Page<LabRequest> res = repo.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(res.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public LabResponse getById(String id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public LabResponse create(LabCreateRequest req) {
        LabRequest lr = mapper.toEntity(req);
        lr.setRequestNumber(numberGenerator.nextLabNumber());
        lr.setStatus("ORDERED");
        lr.setOrderedAt(LocalDateTime.now());
        lr.setCreatedAt(LocalDateTime.now());
        lr.setUpdatedAt(LocalDateTime.now());
        LabRequest saved = repo.save(lr);
        auditService.log("LAB_ORDERED", "LabRequest", saved.getId(), null, "Ordered lab test");
        return mapper.toResponse(saved);
    }

    @Transactional
    public void updateStatus(String id, String newStatus) {
        LabRequest lr = findById(id);
        lr.setStatus(newStatus);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        auditService.log("LAB_STATUS_UPDATED", "LabRequest", id, null, "Status updated to " + newStatus);
    }

    @Transactional
    public void updateResults(String id, LabResultRequest req, String technicianId) {
        LabRequest lr = findById(id);
        lr.setResultsJson(req.getResultsJson());
        lr.setStatus("COMPLETED");
        lr.setCompletedAt(LocalDateTime.now());
        lr.setCompletedById(technicianId);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        auditService.log("LAB_RESULTS_SAVED", "LabRequest", id, null, "Results saved");
        blockchainService.registerLabHash(lr);
        // Notifications stub
    }

    @Transactional
    public String uploadReport(String id, MultipartFile file) {
        LabRequest lr = findById(id);
        String url = "/uploads/labs/" + id + "_" + file.getOriginalFilename();
        lr.setReportUrl(url);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        return url;
    }

    public List<String> getCatalog() {
        return List.of("Complete Blood Count (CBC)", "Basic Metabolic Panel", "Lipid Panel", "Liver Panel");
    }

    private LabRequest findById(String id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
}""",
    "LabController.java": """package com.bchospital.modules.lab;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import com.bchospital.modules.lab.dto.LabResultRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lab")
@RequiredArgsConstructor
@Tag(name = "Lab", description = "Laboratory API")
public class LabController {

    private final LabService service;

    @GetMapping("/requests")
    public ApiResponse<PageResponse<LabResponse>> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String status, @RequestParam(required = false) String priority, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ApiResponse.success(service.getRequests(page, size, status, priority, date));
    }

    @GetMapping("/requests/{id}")
    public ApiResponse<LabResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping("/requests")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<LabResponse> create(@Valid @RequestBody LabCreateRequest request) {
        return ApiResponse.success(service.create(request));
    }

    @PutMapping("/requests/{id}/status")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Void> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        service.updateStatus(id, body.get("status"));
        return ApiResponse.success(null, "Status updated");
    }

    @PutMapping("/requests/{id}/results")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Void> updateResults(@PathVariable String id, @Valid @RequestBody LabResultRequest request, Authentication auth) {
        service.updateResults(id, request, auth.getName());
        return ApiResponse.success(null, "Results updated");
    }

    @PostMapping("/requests/{id}/report")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Map<String, String>> uploadReport(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(Map.of("url", service.uploadReport(id, file)));
    }

    @GetMapping("/tests")
    public ApiResponse<List<String>> getCatalog() {
        return ApiResponse.success(service.getCatalog());
    }
}"""
}

with open(os.path.join(BASE_DIR, "LabRequest.java"), "w") as f: f.write(lab_entity)
with open(os.path.join(BASE_DIR, "LabRequestRepository.java"), "w") as f: f.write(repo)
for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)

