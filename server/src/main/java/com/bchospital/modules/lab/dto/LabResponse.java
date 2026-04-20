package com.bchospital.modules.lab.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class LabResponse {
    private String id;
    private String requestNumber;
    private String patientId;
    private String doctorId;
    private String testName;
    private String testCategory;
    private String status;
    private String priority;
    private String resultsJson;
    private String reportUrl;
    private String notes;
    private LocalDateTime orderedAt;
    private LocalDateTime completedAt;
    private String completedById;
}