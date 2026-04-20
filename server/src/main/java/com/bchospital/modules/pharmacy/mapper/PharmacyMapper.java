package com.bchospital.modules.pharmacy.mapper;
import com.bchospital.modules.pharmacy.Medicine;
import com.bchospital.modules.pharmacy.DispensingLog;
import com.bchospital.modules.pharmacy.dto.MedicineCreateRequest;
import com.bchospital.modules.pharmacy.dto.MedicineResponse;
import com.bchospital.modules.pharmacy.dto.MedicineUpdateRequest;
import com.bchospital.modules.pharmacy.dto.DispensingLogResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PharmacyMapper {
    Medicine toEntity(MedicineCreateRequest req);
    MedicineResponse toResponse(Medicine entity);
    void updateEntity(MedicineUpdateRequest req, @MappingTarget Medicine entity);
    DispensingLogResponse toLogResponse(DispensingLog log);
}