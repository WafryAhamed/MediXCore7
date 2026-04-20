package com.bchospital.modules.user;

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
