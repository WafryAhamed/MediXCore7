package com.bchospital.modules.appointment.mapper;
import com.bchospital.modules.appointment.Appointment;
import com.bchospital.modules.appointment.dto.AppointmentCreateRequest;
import com.bchospital.modules.appointment.dto.AppointmentResponse;
import com.bchospital.modules.appointment.dto.AppointmentUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AppointmentMapper {
    Appointment toEntity(AppointmentCreateRequest request);
    AppointmentResponse toResponse(Appointment appointment);
    void updateEntity(AppointmentUpdateRequest request, @MappingTarget Appointment appointment);
}