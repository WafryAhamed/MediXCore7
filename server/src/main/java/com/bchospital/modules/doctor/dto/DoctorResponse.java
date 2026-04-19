package com.bchospital.modules.doctor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DoctorResponse {
    private String id;
    private String userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private BigDecimal consultationFee;
    private Integer maxPatientsPerDay;
    private List<String> availableDays;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
