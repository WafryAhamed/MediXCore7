package com.bchospital.modules.appointment;
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
}