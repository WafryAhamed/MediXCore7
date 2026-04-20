package com.bchospital.modules.patient.dto;
import lombok.Data;
@Data
public class VitalRequest {
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer heartRate;
    private Double temperature;
    private Integer spo2;
    private Double weight;
    private Double height;
}