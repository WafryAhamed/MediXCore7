package com.bchospital.modules.pharmacy.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MedicineCreateRequest {
    @NotBlank private String name;
    private String genericName;
    @NotBlank private String category;
    private String manufacturer;
    @NotBlank private String unit;
    private Integer stockQuantity;
    private Integer reorderLevel;
    @NotNull private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
}