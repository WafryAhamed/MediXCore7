package com.bchospital.modules.patient.mapper;
import com.bchospital.modules.patient.Patient;
import com.bchospital.modules.patient.dto.PatientCreateRequest;
import com.bchospital.modules.patient.dto.PatientResponse;
import com.bchospital.modules.patient.dto.PatientUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PatientMapper {
    Patient toEntity(PatientCreateRequest request);
    PatientResponse toResponse(Patient patient);
    void updateEntity(PatientUpdateRequest request, @MappingTarget Patient patient);
}