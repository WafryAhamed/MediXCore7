package com.bchospital.modules.doctor.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class DoctorUpdateRequest {
    private String specialty;
    private List<String> qualifications;
    private String licenseNumber;
    private BigDecimal consultationFee;
    private String bio;
}