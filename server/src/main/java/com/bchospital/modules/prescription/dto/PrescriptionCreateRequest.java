package com.bchospital.modules.prescription.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;
@Data
public class PrescriptionCreateRequest {
    @NotBlank private String patientId;
    @NotBlank private String doctorId;
    private String appointmentId;
    private String notes;
    @NotEmpty private List<PrescriptionItemRequest> items;
}