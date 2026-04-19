package com.bchospital.modules.patient;

import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
@Tag(name = "Patients", description = "Patient Management API")
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @Operation(summary = "Get all patients with pagination and search")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ApiResponse<PageResponse<PatientResponse>> getPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        PageResponse<PatientResponse> patients = patientService.getPatients(page, size, search);
        return ApiResponse.success(patients, "Patients retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ApiResponse<PatientResponse> getPatientById(@PathVariable String id) {
        PatientResponse patient = patientService.getPatientById(id);
        return ApiResponse.success(patient, "Patient retrieved successfully");
    }

    @PostMapping
    @Operation(summary = "Register a new patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponse> createPatient(@Valid @RequestBody PatientCreateRequest request) {
        PatientResponse patient = patientService.createPatient(request);
        return ApiResponse.success(patient, "Patient created successfully");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update patient records")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponse> updatePatient(
            @PathVariable String id,
            @Valid @RequestBody PatientUpdateRequest request) {
        PatientResponse patient = patientService.updatePatient(id, request);
        return ApiResponse.success(patient, "Patient updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete / discharge a patient")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ApiResponse.success(null, "Patient soft-deleted successfully");
    }
}
