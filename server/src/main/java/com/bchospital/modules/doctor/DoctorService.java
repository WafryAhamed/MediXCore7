package com.bchospital.modules.doctor;
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
}