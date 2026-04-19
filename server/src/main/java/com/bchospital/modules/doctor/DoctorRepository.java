package com.bchospital.modules.doctor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    Optional<Doctor> findByEmployeeNumber(String employeeNumber);
    Optional<Doctor> findByEmail(String email);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:search IS NULL OR LOWER(d.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:specialization IS NULL OR d.specialization = :specialization)")
    Page<Doctor> findWithFilters(@Param("search") String search, 
                                 @Param("specialization") String specialization, 
                                 Pageable pageable);
}
