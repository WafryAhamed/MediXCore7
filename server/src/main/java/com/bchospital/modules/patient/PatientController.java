package com.bchospital.modules.patient;
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
}