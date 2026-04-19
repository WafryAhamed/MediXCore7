package com.bchospital.modules.doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DoctorCreateRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    private String email;

    private String phone;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private BigDecimal consultationFee;
    private Integer maxPatientsPerDay;
    private List<String> availableDays;
}
