package com.bchospital.modules.lab;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
public class LabSpecification {
    public static Specification<LabRequest> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
    public static Specification<LabRequest> dateAfter(LocalDateTime date) {
        return (root, query, cb) -> date == null ? null : cb.greaterThanOrEqualTo(root.get("orderedAt"), date);
    }
}