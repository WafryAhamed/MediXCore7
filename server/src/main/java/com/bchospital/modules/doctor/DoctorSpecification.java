package com.bchospital.modules.doctor;
import org.springframework.data.jpa.domain.Specification;
public class DoctorSpecification {
    public static Specification<Doctor> specialtyEq(String specialty) {
        return (root, query, cb) -> specialty == null ? null : cb.equal(root.get("specialty"), specialty);
    }
    // "available" logic would be complex in JPQL so we typically handle that in Service or Native Query
    // Stub for basic text search
}