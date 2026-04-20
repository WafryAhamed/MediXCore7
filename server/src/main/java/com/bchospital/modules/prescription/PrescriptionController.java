package com.bchospital.modules.prescription;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.prescription.dto.DispenseRequest;
import com.bchospital.modules.prescription.dto.PrescriptionCreateRequest;
import com.bchospital.modules.prescription.dto.PrescriptionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor
@Tag(name = "Prescriptions")
public class PrescriptionController {
    
    private final PrescriptionService service;

    @GetMapping
    public ApiResponse<PageResponse<PrescriptionResponse>> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String patientId, @RequestParam(required = false) String doctorId, @RequestParam(required = false) String status) {
        return ApiResponse.success(service.getPrescriptions(page, size, patientId, doctorId, status));
    }

    @GetMapping("/{id}")
    public ApiResponse<PrescriptionResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<PrescriptionResponse> create(@Valid @RequestBody PrescriptionCreateRequest request) {
        return ApiResponse.success(service.createPrescription(request));
    }

    @PutMapping("/{id}/dispense")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ApiResponse<Void> dispense(@PathVariable String id, Authentication auth) {
        service.dispense(id, auth.getName());
        return ApiResponse.success(null, "Dispensed");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<Void> cancel(@PathVariable String id) {
        service.cancel(id);
        return ApiResponse.success(null, "Cancelled");
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getPdf(@PathVariable String id) {
        byte[] pdf = service.generatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=RX-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}