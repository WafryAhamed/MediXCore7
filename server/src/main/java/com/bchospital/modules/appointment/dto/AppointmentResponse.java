package com.bchospital.modules.appointment.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder
public class AppointmentResponse {
    private String id;
    private String appointmentNumber;
    private String patientId;
    private String doctorId;
    private LocalDateTime scheduledAt;
    private LocalDateTime endTime;
    private String type;
    private String status;
    private String chiefComplaint;
    private String notes;
    private String cancelReason;
}