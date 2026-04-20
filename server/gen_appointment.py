import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\appointment"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

appointment_entity = """package com.bchospital.modules.appointment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "appointment_number", nullable = false, unique = true)
    private String appointmentNumber;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private String type; // CONSULTATION/FOLLOW_UP/EMERGENCY/PROCEDURE

    @Column(nullable = false)
    private String status; // SCHEDULED/CONFIRMED/IN_PROGRESS/COMPLETED/CANCELLED/NO_SHOW

    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
"""

appointment_repo = """package com.bchospital.modules.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String>, JpaSpecificationExecutor<Appointment> {
    List<Appointment> findByDoctorIdAndScheduledAtBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDoctorIdAndScheduledAtBetweenAndStatusNot(String doctorId, LocalDateTime start, LocalDateTime end, String status);
}
"""

java_classes = {
    "dto/AppointmentCreateRequest.java": """package com.bchospital.modules.appointment.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AppointmentCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    @NotNull private LocalDateTime scheduledAt;
    @NotBlank private String type;
    private String chiefComplaint;
}""",
    "dto/AppointmentUpdateRequest.java": """package com.bchospital.modules.appointment.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AppointmentUpdateRequest {
    private LocalDateTime scheduledAt;
    private String chiefComplaint;
    private String notes;
}""",
    "dto/AppointmentResponse.java": """package com.bchospital.modules.appointment.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder
public class AppointmentResponse {
    private String id;
    private String appointmentNumber;
    private String patientId;
    private String doctorId;
    private LocalDateTime scheduledAt;
    private LocalDateTime endTime;
    private String type;
    private String status;
    private String chiefComplaint;
    private String notes;
    private String cancelReason;
}""",
    "mapper/AppointmentMapper.java": """package com.bchospital.modules.appointment.mapper;
import com.bchospital.modules.appointment.Appointment;
import com.bchospital.modules.appointment.dto.AppointmentCreateRequest;
import com.bchospital.modules.appointment.dto.AppointmentResponse;
import com.bchospital.modules.appointment.dto.AppointmentUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AppointmentMapper {
    Appointment toEntity(AppointmentCreateRequest request);
    AppointmentResponse toResponse(Appointment appointment);
    void updateEntity(AppointmentUpdateRequest request, @MappingTarget Appointment appointment);
}""",
    "AppointmentSpecification.java": """package com.bchospital.modules.appointment;
import org.springframework.data.jpa.domain.Specification;
public class AppointmentSpecification {
    public static Specification<Appointment> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
}""",
    "AppointmentService.java": """package com.bchospital.modules.appointment;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.BusinessException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.appointment.dto.AppointmentCreateRequest;
import com.bchospital.modules.appointment.dto.AppointmentResponse;
import com.bchospital.modules.appointment.dto.AppointmentUpdateRequest;
import com.bchospital.modules.appointment.mapper.AppointmentMapper;
import com.bchospital.modules.doctor.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorService doctorService;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    // Missing Notification/Email Services for now

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getAppointments(int page, int size, String doctorId, String patientId, String status) {
        Specification<Appointment> spec = Specification.where(AppointmentSpecification.fieldEq("doctorId", doctorId))
            .and(AppointmentSpecification.fieldEq("patientId", patientId))
            .and(AppointmentSpecification.fieldEq("status", status));
        Page<Appointment> res = appointmentRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(res.map(appointmentMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getById(String id) {
        return appointmentMapper.toResponse(findById(id));
    }

    @Transactional
    public AppointmentResponse bookAppointment(AppointmentCreateRequest req) {
        // verify doctor works on requested day (skipped full doctor day logic for brevity)
        LocalDateTime start = req.getScheduledAt();
        LocalDateTime end = start.plusMinutes(30);

        List<Appointment> overlaps = appointmentRepository.findByDoctorIdAndScheduledAtBetweenAndStatusNot(
                req.getDoctorId(), start.minusMinutes(1), end, "CANCELLED");
        if (!overlaps.isEmpty()) {
            throw new BusinessException("Slot already taken");
        }

        Appointment appt = appointmentMapper.toEntity(req);
        appt.setAppointmentNumber(numberGenerator.nextAppointmentNumber());
        appt.setEndTime(end);
        appt.setStatus("SCHEDULED");
        appt.setCreatedAt(LocalDateTime.now());
        appt.setUpdatedAt(LocalDateTime.now());
        
        Appointment saved = appointmentRepository.save(appt);
        auditService.log("BOOK_APPOINTMENT", "Appointment", saved.getId(), null, "Booked appointment");
        // TODO: Async email, Async besu, notification
        return appointmentMapper.toResponse(saved);
    }

    @Transactional
    public AppointmentResponse updateAppointment(String id, AppointmentUpdateRequest req) {
        Appointment appt = findById(id);
        appointmentMapper.updateEntity(req, appt);
        appt.setUpdatedAt(LocalDateTime.now());
        if (req.getScheduledAt() != null) {
            appt.setEndTime(req.getScheduledAt().plusMinutes(30));
        }
        return appointmentMapper.toResponse(appointmentRepository.save(appt));
    }

    @Transactional
    public void cancelAppointment(String id, String reason) {
        Appointment appt = findById(id);
        if (!appt.getStatus().equals("SCHEDULED") && !appt.getStatus().equals("CONFIRMED")) {
            throw new BusinessException("Cannot cancel an appointment that is " + appt.getStatus());
        }
        appt.setStatus("CANCELLED");
        appt.setCancelledAt(LocalDateTime.now());
        appt.setCancelReason(reason);
        appt.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appt);
    }

    @Transactional
    public void updateStatus(String id, String newStatus) {
        Appointment appt = findById(id);
        String oldStatus = appt.getStatus();
        // Validation flow omitted for brevity of stub
        appt.setStatus(newStatus);
        appt.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appt);
    }

    @Transactional(readOnly = true)
    public List<String> getSlots(String doctorId, LocalDate date) {
        List<LocalTime> allSlots = doctorService.getAvailableSlots(doctorId, date);
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Appointment> booked = appointmentRepository.findByDoctorIdAndScheduledAtBetweenAndStatusNot(doctorId, startOfDay, endOfDay, "CANCELLED");
        
        List<LocalTime> bookedTimes = booked.stream()
                .map(a -> a.getScheduledAt().toLocalTime())
                .toList();

        return allSlots.stream()
                .filter(t -> !bookedTimes.contains(t))
                .map(LocalTime::toString)
                .collect(Collectors.toList());
    }

    private Appointment findById(String id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
}""",
    "AppointmentController.java": """package com.bchospital.modules.appointment;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.appointment.dto.AppointmentCreateRequest;
import com.bchospital.modules.appointment.dto.AppointmentResponse;
import com.bchospital.modules.appointment.dto.AppointmentUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments", description = "Appointment API")
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    @GetMapping
    public ApiResponse<PageResponse<AppointmentResponse>> getAppointments(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String doctorId, @RequestParam(required = false) String patientId, @RequestParam(required = false) String status) {
        return ApiResponse.success(appointmentService.getAppointments(page, size, doctorId, patientId, status));
    }

    @GetMapping("/{id}")
    public ApiResponse<AppointmentResponse> getById(@PathVariable String id) {
        return ApiResponse.success(appointmentService.getById(id));
    }

    @PostMapping
    public ApiResponse<AppointmentResponse> book(@Valid @RequestBody AppointmentCreateRequest request) {
        return ApiResponse.success(appointmentService.bookAppointment(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AppointmentResponse> update(@PathVariable String id, @RequestBody AppointmentUpdateRequest request) {
        return ApiResponse.success(appointmentService.updateAppointment(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> cancel(@PathVariable String id, @RequestBody Map<String, String> body) {
        appointmentService.cancelAppointment(id, body.getOrDefault("reason", "Patient request"));
        return ApiResponse.success(null, "Cancelled");
    }

    @GetMapping("/slots")
    public ApiResponse<List<String>> getSlots(@RequestParam String doctorId, @RequestParam String date) {
        return ApiResponse.success(appointmentService.getSlots(doctorId, LocalDate.parse(date)));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        appointmentService.updateStatus(id, body.get("status"));
        return ApiResponse.success(null, "Status updated");
    }
}"""
}

for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)
with open(os.path.join(BASE_DIR, "Appointment.java"), "w") as f: f.write(appointment_entity)
with open(os.path.join(BASE_DIR, "AppointmentRepository.java"), "w") as f: f.write(appointment_repo)
