package com.bchospital.modules.prescription.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class PrescriptionResponse {
    private String id;
    private String prescriptionNumber;
    private String patientId;
    private String doctorId;
    private String appointmentId;
    private String status;
    private String notes;
    private LocalDateTime dispensedAt;
    private String dispensedById;
    private String blockchainTxHash;
    private LocalDateTime createdAt;
    private List<PrescriptionItemDto> items;
    
    @Data
    public static class PrescriptionItemDto {
        private String id;
        private String medicationName;
        private String genericName;
        private String dosage;
        private String frequency;
        private String duration;
        private int quantity;
        private String instructions;
        private String medicineId;
    }
}