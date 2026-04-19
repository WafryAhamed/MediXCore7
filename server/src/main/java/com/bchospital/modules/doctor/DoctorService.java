package com.bchospital.modules.doctor;

import com.bchospital.common.exception.ConflictException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import com.bchospital.modules.doctor.mapper.DoctorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final NumberGenerator numberGenerator;

    @Transactional(readOnly = true)
    public PageResponse<DoctorResponse> getDoctors(int page, int size, String search, String specialization) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "firstName"));
        
        Page<Doctor> doctors = doctorRepository.findWithFilters(search, specialization, pageable);
        return PageResponse.from(doctors.map(doctorMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return doctorMapper.toResponse(doctor);
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorCreateRequest request) {
        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email already in use for another doctor");
        }

        Doctor doctor = doctorMapper.toEntity(request);
        doctor.setId(UUID.randomUUID().toString());
        doctor.setEmployeeNumber(numberGenerator.nextDoctorNumber());
        doctor.setStatus("ACTIVE");
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());

        doctorRepository.save(doctor);
        return doctorMapper.toResponse(doctor);
    }

    @Transactional
    public DoctorResponse updateDoctor(String id, DoctorUpdateRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(doctor.getEmail())) {
            if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ConflictException("Email already in use for another doctor");
            }
        }

        doctorMapper.updateEntityFromRequest(request, doctor);
        doctor.setUpdatedAt(LocalDateTime.now());

        doctorRepository.save(doctor);
        return doctorMapper.toResponse(doctor);
    }

    @Transactional
    public void deleteDoctor(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        
        doctor.setStatus("INACTIVE");
        doctor.setUpdatedAt(LocalDateTime.now());
        doctorRepository.save(doctor);
    }
}
