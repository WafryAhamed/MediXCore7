package com.bchospital.modules.appointment.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AppointmentCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    @NotNull private LocalDateTime scheduledAt;
    @NotBlank private String type;
    private String chiefComplaint;
}