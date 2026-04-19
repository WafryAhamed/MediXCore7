package com.bchospital.modules.doctor;

import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctors", description = "Doctor Management API")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get all doctors with pagination, search, and spec filter")
    public ApiResponse<PageResponse<DoctorResponse>> getDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String specialization) {
        
        PageResponse<DoctorResponse> doctors = doctorService.getDoctors(page, size, search, specialization);
        return ApiResponse.success(doctors, "Doctors retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    public ApiResponse<DoctorResponse> getDoctorById(@PathVariable String id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ApiResponse.success(doctor, "Doctor retrieved successfully");
    }

    @PostMapping
    @Operation(summary = "Register a new doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> createDoctor(@Valid @RequestBody DoctorCreateRequest request) {
        DoctorResponse doctor = doctorService.createDoctor(request);
        return ApiResponse.success(doctor, "Doctor created successfully");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update doctor details")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> updateDoctor(
            @PathVariable String id,
            @Valid @RequestBody DoctorUpdateRequest request) {
        DoctorResponse doctor = doctorService.updateDoctor(id, request);
        return ApiResponse.success(doctor, "Doctor updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ApiResponse.success(null, "Doctor deactivated successfully");
    }
}
