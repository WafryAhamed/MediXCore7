import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\user"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

user_entity = """package com.bchospital.modules.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String status;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "avatar_url")
    private String avatarUrl;

    // Password reset fields
    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && (deletedAt == null);
    }
}
"""

user_repo = """package com.bchospital.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
}
"""

user_dto_response = """package com.bchospital.modules.user.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String status;
    private boolean isActive;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
"""

user_dto_update = """package com.bchospital.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}
"""

user_mapper = """package com.bchospital.modules.user.mapper;

import com.bchospital.modules.user.User;
import com.bchospital.modules.user.dto.UserResponse;
import com.bchospital.modules.user.dto.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    UserResponse toResponse(User user);
    void updateEntity(UserUpdateRequest request, @MappingTarget User user);
}
"""

# ... Controller, Service, Specs
user_spec = """package com.bchospital.modules.user;

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
"""

user_service = """package com.bchospital.modules.user;

import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.BusinessException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.user.dto.UserResponse;
import com.bchospital.modules.user.dto.UserUpdateRequest;
import com.bchospital.modules.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(int page, int size, String role, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<User> spec = Specification.where(UserSpecification.isNotDeleted())
                .and(UserSpecification.hasRole(role))
                .and(UserSpecification.hasStatus(status));
                
        Page<User> users = userRepository.findAll(spec, pageable);
        return PageResponse.from(users.map(userMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        return userMapper.toResponse(findById(id));
    }

    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request, String requesterEmail) {
        User user = findById(id);
        userMapper.updateEntity(request, user);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);
        auditService.log("UPDATE_USER", "User", id, null, "Updated basic profile details by " + requesterEmail);
        return userMapper.toResponse(updated);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = findById(id);
        user.setDeletedAt(LocalDateTime.now());
        user.setStatus("INACTIVE");
        userRepository.save(user);
        auditService.log("DELETE_USER", "User", id, null, "Soft deleted user");
    }

    @Transactional
    public void updateRole(String id, String role) {
        User user = findById(id);
        String oldRole = user.getRole();
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        auditService.log("UPDATE_ROLE", "User", id, oldRole, role);
    }

    @Transactional
    public void updateStatus(String id, String status) {
        User user = findById(id);
        String oldStatus = user.getStatus();
        user.setStatus(status);
        if ("ACTIVE".equalsIgnoreCase(status)) {
            user.setActive(true);
            user.setDeletedAt(null);
        } else if ("INACTIVE".equalsIgnoreCase(status)) {
            user.setActive(false);
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        auditService.log("UPDATE_STATUS", "User", id, oldStatus, status);
    }

    @Transactional
    public String uploadAvatar(String id, MultipartFile file) {
        User user = findById(id);
        // Stub for multipart resize logic
        // Save file locally or to blob storage, output fake path for now
        String path = "/uploads/avatars/" + id + "_" + file.getOriginalFilename();
        user.setAvatarUrl(path);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        auditService.log("UPDATE_AVATAR", "User", id, null, "Avatar uploaded");
        return path;
    }

    private User findById(String id) {
        return userRepository.findById(id).filter(u -> u.getDeletedAt() == null)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
}
"""

user_controller = """package com.bchospital.modules.user;

import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.user.dto.UserResponse;
import com.bchospital.modules.user.dto.UserUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User Management API")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users with pagination")
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        return ApiResponse.success(userService.getUsers(page, size, role, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @Operation(summary = "Get a specific user")
    public ApiResponse<UserResponse> getUser(@PathVariable String id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @Operation(summary = "Update user profile")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserUpdateRequest request,
            Authentication auth) {
        return ApiResponse.success(userService.updateUser(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft delete user")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ApiResponse.success(null, "User deleted successfully");
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user role")
    public ApiResponse<Void> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        userService.updateRole(id, body.get("role"));
        return ApiResponse.success(null, "Role updated successfully");
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user status")
    public ApiResponse<Void> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        userService.updateStatus(id, body.get("status"));
        return ApiResponse.success(null, "Status updated successfully");
    }

    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @Operation(summary = "Upload user avatar")
    public ApiResponse<Map<String, String>> uploadAvatar(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        String url = userService.uploadAvatar(id, file);
        return ApiResponse.success(Map.of("avatarUrl", url), "Avatar uploaded successfully");
    }
}
"""

with open(os.path.join(BASE_DIR, "User.java"), "w") as f: f.write(user_entity)
with open(os.path.join(BASE_DIR, "UserRepository.java"), "w") as f: f.write(user_repo)
with open(os.path.join(BASE_DIR, "UserSpecification.java"), "w") as f: f.write(user_spec)
with open(os.path.join(BASE_DIR, "UserService.java"), "w") as f: f.write(user_service)
with open(os.path.join(BASE_DIR, "UserController.java"), "w") as f: f.write(user_controller)
with open(os.path.join(DTO_DIR, "UserResponse.java"), "w") as f: f.write(user_dto_response)
with open(os.path.join(DTO_DIR, "UserUpdateRequest.java"), "w") as f: f.write(user_dto_update)
with open(os.path.join(MAPPER_DIR, "UserMapper.java"), "w") as f: f.write(user_mapper)
