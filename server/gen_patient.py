import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\patient"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

patient_entity = """package com.bchospital.modules.patient;

import com.bchospital.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "patient_number", nullable = false, unique = true)
    private String patientNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(name = "blood_type")
    private String bloodType;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> allergies;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "emergency_contact_json")
    private Map<String, String> emergencyContact;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "address_json")
    private Map<String, String> address;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "insurance_info_json")
    private Map<String, String> insuranceInfo;

    @Column(nullable = false)
    private String status;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
"""

vital_entity = """package com.bchospital.modules.patient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vitals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vital {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "heart_rate")
    private Integer heartRate;

    private Double temperature;
    
    private Integer spo2;
    private Double weight;
    private Double height;
    private Double bmi;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "recorded_by_id", nullable = false)
    private String recordedById;
}
"""

patient_repo = """package com.bchospital.modules.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String>, JpaSpecificationExecutor<Patient> {
}
"""

vital_repo = """package com.bchospital.modules.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalRepository extends JpaRepository<Vital, String> {
    List<Vital> findByPatientIdOrderByRecordedAtDesc(String patientId);
}
"""

patient_dto = """package com.bchospital.modules.patient.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.util.Map;
import java.util.List;

@Data
public class PatientCreateRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private List<String> allergies;
    private Map<String, String> emergencyContact;
    private Map<String, String> address;
    private Map<String, String> insuranceInfo;
}
"""

# ... plus PatientUpdateRequest, PatientResponse, VitalRequest, VitalResponse, Mappers, Specifications
# I will output the whole block in another file. For brevity...

# Due to space, I'm packing them together
java_classes = {
    "dto/PatientUpdateRequest.java": """package com.bchospital.modules.patient.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
@Data
public class PatientUpdateRequest {
    private String phone;
    private String email;
    private List<String> allergies;
    private Map<String, String> emergencyContact;
    private Map<String, String> address;
    private Map<String, String> insuranceInfo;
}""",
    "dto/PatientResponse.java": """package com.bchospital.modules.patient.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
@Data
@Builder
public class PatientResponse {
    private String id;
    private String patientNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private List<String> allergies;
    private Map<String, String> emergencyContact;
    private Map<String, String> address;
    private Map<String, String> insuranceInfo;
    private String status;
    private String blockchainTxHash;
}""",
    "dto/VitalRequest.java": """package com.bchospital.modules.patient.dto;
import lombok.Data;
@Data
public class VitalRequest {
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer heartRate;
    private Double temperature;
    private Integer spo2;
    private Double weight;
    private Double height;
}""",
    "mapper/PatientMapper.java": """package com.bchospital.modules.patient.mapper;
import com.bchospital.modules.patient.Patient;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PatientMapper {
    Patient toEntity(PatientCreateRequest request);
    PatientResponse toResponse(Patient patient);
    void updateEntity(PatientUpdateRequest request, @MappingTarget Patient patient);
}""",
    "PatientSpecification.java": """package com.bchospital.modules.patient;
import org.springframework.data.jpa.domain.Specification;
public class PatientSpecification {
    public static Specification<Patient> search(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            String pattern = "%" + term.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("lastName")), pattern),
                cb.like(cb.lower(root.get("patientNumber")), pattern),
                cb.like(cb.lower(root.get("email")), pattern),
                cb.like(cb.lower(root.get("phone")), pattern)
            );
        };
    }
    public static Specification<Patient> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }
}""",
    "PatientService.java": """package com.bchospital.modules.patient;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.blockchain.BlockchainService;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import com.bchospital.modules.patient.dto.VitalRequest;
import com.bchospital.modules.patient.mapper.PatientMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final VitalRepository vitalRepository;
    private final PatientMapper patientMapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    private final BlockchainService blockchainService;

    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> getPatients(int page, int size, String search) {
        Specification<Patient> spec = Specification.where(PatientSpecification.isNotDeleted())
                .and(PatientSpecification.search(search));
        Page<Patient> patients = patientRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(patients.map(patientMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String id) {
        return patientMapper.toResponse(findById(id));
    }

    @Transactional
    public PatientResponse createPatient(PatientCreateRequest request) {
        Patient patient = patientMapper.toEntity(request);
        patient.setPatientNumber(numberGenerator.nextPatientNumber());
        patient.setStatus("ACTIVE");
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        Patient saved = patientRepository.save(patient);
        
        blockchainService.registerPatientHash(saved);
        auditService.log("CREATE_PATIENT", "Patient", saved.getId(), null, "Created new patient");
        return patientMapper.toResponse(saved);
    }

    @Transactional
    public PatientResponse updatePatient(String id, PatientUpdateRequest request) {
        Patient patient = findById(id);
        patientMapper.updateEntity(request, patient);
        patient.setUpdatedAt(LocalDateTime.now());
        Patient updated = patientRepository.save(patient);
        auditService.log("UPDATE_PATIENT", "Patient", id, null, "Updated patient details");
        return patientMapper.toResponse(updated);
    }

    @Transactional
    public void deletePatient(String id) {
        Patient patient = findById(id);
        patient.setDeletedAt(LocalDateTime.now());
        patient.setStatus("INACTIVE");
        patientRepository.save(patient);
        auditService.log("DELETE_PATIENT", "Patient", id, null, "Soft deleted patient");
    }

    @Transactional
    public Vital recordVitals(String patientId, VitalRequest request, String doctorId) {
        Double bmi = null;
        if (request.getWeight() != null && request.getHeight() != null && request.getHeight() > 0) {
            double hM = request.getHeight() / 100.0;
            bmi = request.getWeight() / (hM * hM);
        }
        
        Vital vital = Vital.builder()
                .patientId(patientId)
                .systolicBp(request.getSystolicBp())
                .diastolicBp(request.getDiastolicBp())
                .heartRate(request.getHeartRate())
                .temperature(request.getTemperature())
                .spo2(request.getSpo2())
                .weight(request.getWeight())
                .height(request.getHeight())
                .bmi(bmi)
                .recordedAt(LocalDateTime.now())
                .recordedById(doctorId)
                .build();
                
        return vitalRepository.save(vital);
    }

    @Transactional(readOnly = true)
    public List<Vital> getVitals(String patientId) {
        return vitalRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    public Patient findById(String id) {
        return patientRepository.findById(id).filter(p -> p.getDeletedAt() == null)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    }
}""",
    "PatientController.java": """package com.bchospital.modules.patient;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import com.bchospital.modules.patient.dto.VitalRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
@Tag(name = "Patients", description = "Patient API")
public class PatientController {
    
    private final PatientService patientService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ApiResponse<PageResponse<PatientResponse>> getPatients(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String search) {
        return ApiResponse.success(patientService.getPatients(page, size, search));
    }

    @GetMapping("/{id}")
    public ApiResponse<PatientResponse> getPatient(@PathVariable String id) {
        return ApiResponse.success(patientService.getPatientById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponse> createPatient(@Valid @RequestBody PatientCreateRequest request) {
        return ApiResponse.success(patientService.createPatient(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponse> updatePatient(@PathVariable String id, @Valid @RequestBody PatientUpdateRequest request) {
        return ApiResponse.success(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ApiResponse.success(null, "Deleted");
    }

    @PostMapping("/{id}/vitals")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE')")
    public ApiResponse<Vital> postVitals(@PathVariable String id, @RequestBody VitalRequest request, Authentication auth) {
        return ApiResponse.success(patientService.recordVitals(id, request, auth.getName()));
    }

    @GetMapping("/{id}/vitals")
    public ApiResponse<List<Vital>> getVitals(@PathVariable String id) {
        return ApiResponse.success(patientService.getVitals(id));
    }
}"""
}

with open(os.path.join(BASE_DIR, "Patient.java"), "w") as f: f.write(patient_entity)
with open(os.path.join(BASE_DIR, "Vital.java"), "w") as f: f.write(vital_entity)
with open(os.path.join(BASE_DIR, "PatientRepository.java"), "w") as f: f.write(patient_repo)
with open(os.path.join(BASE_DIR, "VitalRepository.java"), "w") as f: f.write(vital_repo)

for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)
