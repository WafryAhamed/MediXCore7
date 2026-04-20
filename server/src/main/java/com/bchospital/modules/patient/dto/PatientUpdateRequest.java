package com.bchospital.modules.patient.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
@Data
public class PatientUpdateRequest {
    private String phone;
    private String email;
    private List<String> allergies;
    private Map<String, String> emergencyContact;
    private Map<String, String> address;
    private Map<String, String> insuranceInfo;
}