package com.bchospital.modules.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String>, JpaSpecificationExecutor<Appointment> {
    List<Appointment> findByDoctorIdAndScheduledAtBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDoctorIdAndScheduledAtBetweenAndStatusNot(String doctorId, LocalDateTime start, LocalDateTime end, String status);
}
