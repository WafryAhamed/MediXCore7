package com.bchospital.modules.doctor;

import com.bchospital.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_number", nullable = false, unique = true)
    private String employeeNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String specialty;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> qualifications;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "working_days")
    private List<String> workingDays;

    @Column(name = "working_hours_start")
    private String workingHoursStart;

    @Column(name = "working_hours_end")
    private String workingHoursEnd;

    @Column(name = "max_patients_per_day")
    @Builder.Default
    private int maxPatientsPerDay = 20;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
