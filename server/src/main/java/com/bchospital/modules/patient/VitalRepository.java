package com.bchospital.modules.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalRepository extends JpaRepository<Vital, String> {
    List<Vital> findByPatientIdOrderByRecordedAtDesc(String patientId);
}
