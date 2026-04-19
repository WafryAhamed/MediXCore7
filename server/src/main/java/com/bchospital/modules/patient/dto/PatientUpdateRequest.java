package com.bchospital.modules.patient.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class PatientUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String allergies;
    private Map<String, String> emergencyContact;
    private String address;
    private String status;
}
