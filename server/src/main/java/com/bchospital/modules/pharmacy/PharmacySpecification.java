package com.bchospital.modules.pharmacy;
import org.springframework.data.jpa.domain.Specification;
public class PharmacySpecification {
    public static Specification<Medicine> statusEq(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}