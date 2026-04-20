package com.bchospital.modules.lab;
import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import com.bchospital.modules.lab.dto.LabResultRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lab")
@RequiredArgsConstructor
@Tag(name = "Lab", description = "Laboratory API")
public class LabController {

    private final LabService service;

    @GetMapping("/requests")
    public ApiResponse<PageResponse<LabResponse>> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String status, @RequestParam(required = false) String priority, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ApiResponse.success(service.getRequests(page, size, status, priority, date));
    }

    @GetMapping("/requests/{id}")
    public ApiResponse<LabResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping("/requests")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<LabResponse> create(@Valid @RequestBody LabCreateRequest request) {
        return ApiResponse.success(service.create(request));
    }

    @PutMapping("/requests/{id}/status")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Void> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        service.updateStatus(id, body.get("status"));
        return ApiResponse.success(null, "Status updated");
    }

    @PutMapping("/requests/{id}/results")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Void> updateResults(@PathVariable String id, @Valid @RequestBody LabResultRequest request, Authentication auth) {
        service.updateResults(id, request, auth.getName());
        return ApiResponse.success(null, "Results updated");
    }

    @PostMapping("/requests/{id}/report")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    public ApiResponse<Map<String, String>> uploadReport(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(Map.of("url", service.uploadReport(id, file)));
    }

    @GetMapping("/tests")
    public ApiResponse<List<String>> getCatalog() {
        return ApiResponse.success(service.getCatalog());
    }
}