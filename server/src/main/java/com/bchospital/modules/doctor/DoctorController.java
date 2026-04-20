package com.bchospital.modules.doctor;
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
}