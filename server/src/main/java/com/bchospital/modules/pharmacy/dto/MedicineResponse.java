package com.bchospital.modules.pharmacy.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineResponse {
    private String id;
    private String name;
    private String genericName;
    private String category;
    private String manufacturer;
    private String unit;
    private int stockQuantity;
    private int reorderLevel;
    private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
    private String status;
}