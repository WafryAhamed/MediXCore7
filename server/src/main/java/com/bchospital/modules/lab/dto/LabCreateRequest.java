package com.bchospital.modules.lab.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LabCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    private String appointmentId;
    @NotBlank private String testName;
    @NotBlank private String testCategory;
    @NotBlank private String priority;
    private String notes;
}