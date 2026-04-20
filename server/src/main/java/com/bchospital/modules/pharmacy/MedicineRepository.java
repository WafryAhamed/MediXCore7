package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String>, JpaSpecificationExecutor<Medicine> {
    List<Medicine> findByStockQuantityLessThanEqualAndStatus(int quantity, String status);
    List<Medicine> findByExpiryDateBetweenAndStatus(LocalDate now, LocalDate future, String status);
}
