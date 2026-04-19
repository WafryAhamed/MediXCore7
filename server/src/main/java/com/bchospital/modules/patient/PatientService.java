package com.bchospital.modules.patient;

import com.bchospital.common.exception.ConflictException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import com.bchospital.modules.patient.mapper.PatientMapper;
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
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final NumberGenerator numberGenerator;

    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> getPatients(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Patient> patients;

        if (search != null && !search.trim().isEmpty()) {
            patients = patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(
                    search, search, search, pageable);
        } else {
            patients = patientRepository.findAll(pageable);
        }

        return PageResponse.from(patients.map(patientMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return patientMapper.toResponse(patient);
    }

    @Transactional
    public PatientResponse createPatient(PatientCreateRequest request) {
        if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email already in use for another patient");
        }

        Patient patient = patientMapper.toEntity(request);
        patient.setId(UUID.randomUUID().toString());
        patient.setPatientNumber(numberGenerator.nextPatientNumber());
        patient.setStatus("ACTIVE");
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());

        patientRepository.save(patient);
        return patientMapper.toResponse(patient);
    }

    @Transactional
    public PatientResponse updatePatient(String id, PatientUpdateRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(patient.getEmail())) {
            if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ConflictException("Email already in use for another patient");
            }
        }

        patientMapper.updateEntityFromRequest(request, patient);
        patient.setUpdatedAt(LocalDateTime.now());

        patientRepository.save(patient);
        return patientMapper.toResponse(patient);
    }

    @Transactional
    public void deletePatient(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        // Soft delete
        patient.setStatus("DISCHARGED"); // Or INACTIVE depending on exact requirements
        patient.setUpdatedAt(LocalDateTime.now());
        patientRepository.save(patient);
    }
}
