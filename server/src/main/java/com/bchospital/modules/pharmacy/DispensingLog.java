package com.bchospital.modules.pharmacy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispensing_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DispensingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "medicine_id", nullable = false)
    private String medicineId;

    @Column(name = "prescription_id")
    private String prescriptionId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String type; // DISPENSE/RESTOCK/ADJUSTMENT

    private String reference;

    @Column(name = "dispensed_by_id", nullable = false)
    private String dispensedById;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
