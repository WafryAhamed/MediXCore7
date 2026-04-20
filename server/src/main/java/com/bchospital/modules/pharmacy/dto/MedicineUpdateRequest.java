package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineUpdateRequest {
    private String manufacturer;
    private Integer reorderLevel;
    private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
    private String status;
}