package com.bchospital.modules.lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, String>, JpaSpecificationExecutor<LabRequest> {
}
