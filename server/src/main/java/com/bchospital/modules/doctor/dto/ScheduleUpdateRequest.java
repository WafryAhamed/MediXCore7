package com.bchospital.modules.doctor.dto;
import lombok.Data;
import java.util.List;
@Data
public class ScheduleUpdateRequest {
    private List<String> workingDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer maxPatientsPerDay;
}