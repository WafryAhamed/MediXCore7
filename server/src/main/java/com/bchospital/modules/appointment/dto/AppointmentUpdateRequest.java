package com.bchospital.modules.appointment.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AppointmentUpdateRequest {
    private LocalDateTime scheduledAt;
    private String chiefComplaint;
    private String notes;
}