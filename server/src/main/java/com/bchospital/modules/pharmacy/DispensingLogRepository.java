package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DispensingLogRepository extends JpaRepository<DispensingLog, String> {
}
