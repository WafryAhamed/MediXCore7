package com.bchospital.modules.prescription;
import org.springframework.data.jpa.domain.Specification;
public class PrescriptionSpecification {
    public static Specification<Prescription> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
}