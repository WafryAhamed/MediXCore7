package com.bchospital.modules.patient;

import com.bchospital.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "patient_number", nullable = false, unique = true)
    private String patientNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(name = "blood_type")
    private String bloodType;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> allergies;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "emergency_contact_json")
    private Map<String, String> emergencyContact;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "address_json")
    private Map<String, String> address;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "insurance_info_json")
    private Map<String, String> insuranceInfo;

    @Column(nullable = false)
    private String status;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
