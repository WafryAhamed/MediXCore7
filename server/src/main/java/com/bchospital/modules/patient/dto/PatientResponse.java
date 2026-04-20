package com.bchospital.modules.patient.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
@Data
@Builder
public class PatientResponse {
    private String id;
    private String patientNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private List<String> allergies;
    private Map<String, String> emergencyContact;
    private Map<String, String> address;
    private Map<String, String> insuranceInfo;
    private String status;
    private String blockchainTxHash;
}