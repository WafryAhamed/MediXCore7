package com.bchospital.modules.doctor.mapper;

import com.bchospital.modules.doctor.Doctor;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorMapper {

    @Mapping(target = "userId", source = "user.id")
    DoctorResponse toResponse(Doctor doctor);

    Doctor toEntity(DoctorCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(DoctorUpdateRequest request, @MappingTarget Doctor doctor);
}
