package com.bchospital.modules.appointment;
import org.springframework.data.jpa.domain.Specification;
public class AppointmentSpecification {
    public static Specification<Appointment> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
}