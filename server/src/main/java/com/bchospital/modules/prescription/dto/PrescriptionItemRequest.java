package com.bchospital.modules.prescription.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class PrescriptionItemRequest {
    @NotBlank private String medicationName;
    private String genericName;
    @NotBlank private String dosage;
    @NotBlank private String frequency;
    @NotBlank private String duration;
    private int quantity;
    private String instructions;
    private String medicineId;
}