package com.bchospital.modules.doctor.mapper;
import com.bchospital.modules.doctor.Doctor;
import com.bchospital.modules.doctor.dto.DoctorCreateRequest;
import com.bchospital.modules.doctor.dto.DoctorResponse;
import com.bchospital.modules.doctor.dto.DoctorUpdateRequest;
import com.bchospital.modules.doctor.dto.ScheduleUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DoctorMapper {
    @Mapping(target = "user.id", source = "userId")
    Doctor toEntity(DoctorCreateRequest request);
    @Mapping(target = "userId", source = "user.id")
    DoctorResponse toResponse(Doctor doctor);
    void updateEntity(DoctorUpdateRequest request, @MappingTarget Doctor doctor);
    void updateSchedule(ScheduleUpdateRequest request, @MappingTarget Doctor doctor);
}