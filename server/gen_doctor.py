import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\doctor"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

doctor_entity = """package com.bchospital.modules.doctor;

import com.bchospital.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_number", nullable = false, unique = true)
    private String employeeNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String specialty;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> qualifications;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "working_days")
    private List<String> workingDays;

    @Column(name = "working_hours_start")
    private String workingHoursStart;

    @Column(name = "working_hours_end")
    private String workingHoursEnd;

    @Column(name = "max_patients_per_day")
    @Builder.Default
    private int maxPatientsPerDay = 20;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
"""

doctor_repo = """package com.bchospital.modules.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String>, JpaSpecificationExecutor<Doctor> {
    Optional<Doctor> findByUserId(String userId);
}
"""

java_classes = {
    "dto/DoctorCreateRequest.java": """package com.bchospital.modules.doctor.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class DoctorCreateRequest {
    @NotBlank private String userId;
    @NotBlank private String specialty;
    private List<String> qualifications;
    @NotBlank private String licenseNumber;
    private BigDecimal consultationFee;
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer maxPatientsPerDay;
    private String bio;
}""",
    "dto/DoctorUpdateRequest.java": """package com.bchospital.modules.doctor.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class DoctorUpdateRequest {
    private String specialty;
    private List<String> qualifications;
    private String licenseNumber;
    private BigDecimal consultationFee;
    private String bio;
}""",
    "dto/ScheduleUpdateRequest.java": """package com.bchospital.modules.doctor.dto;
import lombok.Data;
import java.util.List;
@Data
public class ScheduleUpdateRequest {
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer maxPatientsPerDay;
}""",
    "dto/DoctorResponse.java": """package com.bchospital.modules.doctor.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
@Data
@Builder
public class DoctorResponse {
    private String id;
    private String employeeNumber;
    private String userId;
    private String specialty;
    private List<String> qualifications;
    private String licenseNumber;
    private BigDecimal consultationFee;
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private int maxPatientsPerDay;
    private String bio;
}""",
    "mapper/DoctorMapper.java": """package com.bchospital.modules.doctor.mapper;
import com.bchospital.modules.doctor.Doctor;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import com.bchospital.modules.doctor.dto.ScheduleUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DoctorMapper {
    @Mapping(target = "user.id", source = "userId")
    Doctor toEntity(DoctorCreateRequest request);
    @Mapping(target = "userId", source = "user.id")
    DoctorResponse toResponse(Doctor doctor);
    void updateEntity(DoctorUpdateRequest request, @MappingTarget Doctor doctor);
    void updateSchedule(ScheduleUpdateRequest request, @MappingTarget Doctor doctor);
}""",
    "DoctorSpecification.java": """package com.bchospital.modules.doctor;
import org.springframework.data.jpa.domain.Specification;
public class DoctorSpecification {
    public static Specification<Doctor> specialtyEq(String specialty) {
        return (root, query, cb) -> specialty == null ? null : cb.equal(root.get("specialty"), specialty);
    }
    // "available" logic would be complex in JPQL so we typically handle that in Service or Native Query
    // Stub for basic text search
}""",
    "DoctorService.java": """package com.bchospital.modules.doctor;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import com.bchospital.modules.doctor.dto.ScheduleUpdateRequest;
import com.bchospital.modules.doctor.mapper.DoctorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    // ... AppointmentRepository for slots later

    @Transactional(readOnly = true)
    public PageResponse<DoctorResponse> getDoctors(int page, int size, String specialty) {
        Specification<Doctor> spec = Specification.where(DoctorSpecification.specialtyEq(specialty));
        Page<Doctor> doctors = doctorRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(doctors.map(doctorMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(String id) {
        return doctorMapper.toResponse(findById(id));
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorCreateRequest request) {
        Doctor doctor = doctorMapper.toEntity(request);
        doctor.setEmployeeNumber(numberGenerator.nextDoctorNumber());
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());
        if (doctor.getMaxPatientsPerDay() == 0) doctor.setMaxPatientsPerDay(20);
        Doctor saved = doctorRepository.save(doctor);
        auditService.log("CREATE_DOCTOR", "Doctor", saved.getId(), null, "Created Doctor profile");
        return doctorMapper.toResponse(saved);
    }

    @Transactional
    public DoctorResponse updateDoctor(String id, DoctorUpdateRequest request) {
        Doctor doctor = findById(id);
        doctorMapper.updateEntity(request, doctor);
        doctor.setUpdatedAt(LocalDateTime.now());
        Doctor saved = doctorRepository.save(doctor);
        auditService.log("UPDATE_DOCTOR", "Doctor", id, null, "Updated Doctor details");
        return doctorMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ScheduleUpdateRequest getSchedule(String id) {
        Doctor d = findById(id);
        ScheduleUpdateRequest s = new ScheduleUpdateRequest();
        s.setWorkingDays(d.getWorkingDays());
        s.setWorkingHoursStart(d.getWorkingHoursStart());
        s.setWorkingHoursEnd(d.getWorkingHoursEnd());
        s.setMaxPatientsPerDay(d.getMaxPatientsPerDay());
        return s;
    }

    @Transactional
    public void updateSchedule(String id, ScheduleUpdateRequest request) {
        Doctor doctor = findById(id);
        doctorMapper.updateSchedule(request, doctor);
        doctor.setUpdatedAt(LocalDateTime.now());
        doctorRepository.save(doctor);
        auditService.log("UPDATE_SCHEDULE", "Doctor", id, null, "Updated Doctor schedule");
    }

    @Transactional(readOnly = true)
    public boolean isAvailableToday(String id) {
        Doctor doctor = findById(id);
        if (doctor.getWorkingDays() == null || doctor.getWorkingDays().isEmpty()) return false;
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        return doctor.getWorkingDays().contains(today.name());
    }

    @Transactional(readOnly = true)
    public List<LocalTime> getAvailableSlots(String id, LocalDate date) {
        Doctor d = findById(id);
        List<LocalTime> allSlots = new ArrayList<>();
        if (d.getWorkingDays() == null || !d.getWorkingDays().contains(date.getDayOfWeek().name())) return allSlots;
        if (d.getWorkingHoursStart() == null || d.getWorkingHoursEnd() == null) return allSlots;

        LocalTime start = LocalTime.parse(d.getWorkingHoursStart());
        LocalTime end = LocalTime.parse(d.getWorkingHoursEnd());
        
        while (start.isBefore(end)) {
            allSlots.add(start);
            start = start.plusMinutes(30);
        }
        // TODO: We need AppointmentService to subtract booked slots
        // Stub for now
        return allSlots;
    }

    public Doctor findById(String id) {
        return doctorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }
}""",
    "DoctorController.java": """package com.bchospital.modules.doctor;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import com.bchospital.modules.doctor.dto.ScheduleUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctors", description = "Doctor API")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ApiResponse<PageResponse<DoctorResponse>> getDoctors(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String specialty) {
        return ApiResponse.success(doctorService.getDoctors(page, size, specialty));
    }

    @GetMapping("/{id}")
    public ApiResponse<DoctorResponse> getDoctor(@PathVariable String id) {
        return ApiResponse.success(doctorService.getDoctorById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> createDoctor(@Valid @RequestBody DoctorCreateRequest request) {
        return ApiResponse.success(doctorService.createDoctor(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> updateDoctor(@PathVariable String id, @RequestBody DoctorUpdateRequest request) {
        return ApiResponse.success(doctorService.updateDoctor(id, request));
    }

    @GetMapping("/{id}/schedule")
    public ApiResponse<ScheduleUpdateRequest> getSchedule(@PathVariable String id) {
        return ApiResponse.success(doctorService.getSchedule(id));
    }

    @PutMapping("/{id}/schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> updateSchedule(@PathVariable String id, @RequestBody ScheduleUpdateRequest request) {
        doctorService.updateSchedule(id, request);
        return ApiResponse.success(null, "Schedule updated");
    }
}"""
}

with open(os.path.join(BASE_DIR, "Doctor.java"), "w") as f: f.write(doctor_entity)
with open(os.path.join(BASE_DIR, "DoctorRepository.java"), "w") as f: f.write(doctor_repo)
for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)

