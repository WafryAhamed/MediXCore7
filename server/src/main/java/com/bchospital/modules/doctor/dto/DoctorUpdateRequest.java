package com.bchospital.modules.doctor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DoctorUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private BigDecimal consultationFee;
    private Integer maxPatientsPerDay;
    private List<String> availableDays;
    private String status;
}
