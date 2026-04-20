package com.bchospital.modules.patient;
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
}