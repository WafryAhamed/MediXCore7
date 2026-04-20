package com.bchospital.modules.user.mapper;

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
