package com.bchospital.modules.appointment;
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
}