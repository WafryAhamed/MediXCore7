package com.bchospital.modules.doctor.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
@Data
@Builder
public class DoctorResponse {
    private String id;
    private String employeeNumber;
    private String userId;
    private String specialty;
    private List<String> qualifications;
    private String licenseNumber;
    private BigDecimal consultationFee;
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private int maxPatientsPerDay;
    private String bio;
}