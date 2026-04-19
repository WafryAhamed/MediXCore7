package com.bchospital.modules.patient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByPatientNumber(String patientNumber);
    Optional<Patient> findByEmail(String email);
    
    Page<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(
            String firstName, String lastName, String patientNumber, Pageable pageable);
}
