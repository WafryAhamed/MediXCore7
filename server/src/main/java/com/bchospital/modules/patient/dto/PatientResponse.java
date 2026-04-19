package com.bchospital.modules.patient.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class PatientResponse {
    private String id;
    private String userId; // Optional, might be null if no user account linked yet
    private String patientNumber;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
