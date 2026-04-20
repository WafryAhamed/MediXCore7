package com.bchospital.modules.lab.mapper;
import com.bchospital.modules.lab.LabRequest;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LabMapper {
    LabRequest toEntity(LabCreateRequest request);
    LabResponse toResponse(LabRequest req);
}