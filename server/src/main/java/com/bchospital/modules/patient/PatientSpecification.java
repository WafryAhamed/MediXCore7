package com.bchospital.modules.patient;
import org.springframework.data.jpa.domain.Specification;
public class PatientSpecification {
    public static Specification<Patient> search(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            String pattern = "%" + term.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("lastName")), pattern),
                cb.like(cb.lower(root.get("patientNumber")), pattern),
                cb.like(cb.lower(root.get("email")), pattern),
                cb.like(cb.lower(root.get("phone")), pattern)
            );
        };
    }
    public static Specification<Patient> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }
}