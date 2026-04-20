package com.bchospital.modules.doctor.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class DoctorCreateRequest {
    @NotBlank private String userId;
    @NotBlank private String specialty;
    private List<String> qualifications;
    @NotBlank private String licenseNumber;
    private BigDecimal consultationFee;
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer maxPatientsPerDay;
    private String bio;
}