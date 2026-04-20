package com.bchospital.modules.pharmacy.dto;
import jakarta.validation.constraints.Min;
import lombok.Data;
@Data
public class RestockRequest {
    @Min(1) private int quantity;
    private String reference;
}