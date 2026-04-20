package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class DispensingLogResponse {
    private String id;
    private String medicineId;
    private String prescriptionId;
    private int quantity;
    private String type;
    private String reference;
    private String dispensedById;
    private LocalDateTime createdAt;
}