package com.bchospital.modules.user;

import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> hasRole(String role) {
        return (root, query, cb) -> role == null ? null : cb.equal(root.get("role"), role);
    }
    public static Specification<User> hasStatus(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<User> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }
}
