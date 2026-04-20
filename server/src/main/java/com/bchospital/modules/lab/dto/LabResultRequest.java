package com.bchospital.modules.lab.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LabResultRequest {
    @NotBlank private String resultsJson;
}