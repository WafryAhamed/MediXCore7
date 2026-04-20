package com.bchospital.modules.lab;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "request_number", nullable = false, unique = true)
    private String requestNumber;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "test_category", nullable = false)
    private String testCategory;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String priority;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "results_json")
    private String resultsJson;

    @Column(name = "report_url")
    private String reportUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "completed_by_id")
    private String completedById;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
