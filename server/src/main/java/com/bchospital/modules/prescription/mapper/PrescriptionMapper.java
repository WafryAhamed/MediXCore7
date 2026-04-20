package com.bchospital.modules.prescription.mapper;
import com.bchospital.modules.prescription.Prescription;
import com.bchospital.modules.prescription.PrescriptionItem;
import com.bchospital.modules.prescription.dto.PrescriptionCreateRequest;
import com.bchospital.modules.prescription.dto.PrescriptionItemRequest;
import com.bchospital.modules.prescription.dto.PrescriptionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PrescriptionMapper {
    @Mapping(target = "items", ignore = true)
    Prescription toEntity(PrescriptionCreateRequest request);
    PrescriptionItem toItemEntity(PrescriptionItemRequest request);
    PrescriptionResponse toResponse(Prescription prescription);
}