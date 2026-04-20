package com.bchospital.modules.pharmacy;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.pharmacy.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pharmacy")
@RequiredArgsConstructor
@Tag(name = "Pharmacy")
public class PharmacyController {

    private final PharmacyService service;

    @GetMapping("/inventory")
    public ApiResponse<PageResponse<MedicineResponse>> getInventory(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String status, @RequestParam(required = false) Boolean lowStock) {
        return ApiResponse.success(service.getInventory(page, size, status, lowStock));
    }

    @GetMapping("/inventory/{id}")
    public ApiResponse<MedicineResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping("/inventory")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<MedicineResponse> create(@Valid @RequestBody MedicineCreateRequest request) {
        return ApiResponse.success(service.create(request));
    }

    @PutMapping("/inventory/{id}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<MedicineResponse> update(@PathVariable String id, @RequestBody MedicineUpdateRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @PostMapping("/inventory/{id}/restock")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<Void> restock(@PathVariable String id, @Valid @RequestBody RestockRequest request, Authentication auth) {
        service.restock(id, request, auth.getName());
        return ApiResponse.success(null, "Restocked");
    }

    @GetMapping("/dispensing-log")
    public ApiResponse<PageResponse<DispensingLogResponse>> getLogs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(service.getLogs(page, size));
    }

    @GetMapping("/alerts")
    public ApiResponse<Map<String, List<MedicineResponse>>> getAlerts() {
        return ApiResponse.success(Map.of(
            "lowStock", service.getLowStockAlerts(),
            "expiringSoon", service.getExpiryAlerts()
        ));
    }
}