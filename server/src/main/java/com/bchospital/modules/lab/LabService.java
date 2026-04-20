package com.bchospital.modules.lab;
import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.blockchain.BlockchainService;
import com.bchospital.modules.lab.dto.LabCreateRequest;
import com.bchospital.modules.lab.dto.LabResponse;
import com.bchospital.modules.lab.dto.LabResultRequest;
import com.bchospital.modules.lab.mapper.LabMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabRequestRepository repo;
    private final LabMapper mapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;
    private final BlockchainService blockchainService;

    @Transactional(readOnly = true)
    public PageResponse<LabResponse> getRequests(int page, int size, String status, String priority, LocalDateTime date) {
        Specification<LabRequest> spec = Specification.where(LabSpecification.fieldEq("status", status))
                .and(LabSpecification.fieldEq("priority", priority))
                .and(LabSpecification.dateAfter(date));
        Page<LabRequest> res = repo.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(res.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public LabResponse getById(String id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public LabResponse create(LabCreateRequest req) {
        LabRequest lr = mapper.toEntity(req);
        lr.setRequestNumber(numberGenerator.nextLabNumber());
        lr.setStatus("ORDERED");
        lr.setOrderedAt(LocalDateTime.now());
        lr.setCreatedAt(LocalDateTime.now());
        lr.setUpdatedAt(LocalDateTime.now());
        LabRequest saved = repo.save(lr);
        auditService.log("LAB_ORDERED", "LabRequest", saved.getId(), null, "Ordered lab test");
        return mapper.toResponse(saved);
    }

    @Transactional
    public void updateStatus(String id, String newStatus) {
        LabRequest lr = findById(id);
        lr.setStatus(newStatus);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        auditService.log("LAB_STATUS_UPDATED", "LabRequest", id, null, "Status updated to " + newStatus);
    }

    @Transactional
    public void updateResults(String id, LabResultRequest req, String technicianId) {
        LabRequest lr = findById(id);
        lr.setResultsJson(req.getResultsJson());
        lr.setStatus("COMPLETED");
        lr.setCompletedAt(LocalDateTime.now());
        lr.setCompletedById(technicianId);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        auditService.log("LAB_RESULTS_SAVED", "LabRequest", id, null, "Results saved");
        blockchainService.registerLabHash(lr);
        // Notifications stub
    }

    @Transactional
    public String uploadReport(String id, MultipartFile file) {
        LabRequest lr = findById(id);
        String url = "/uploads/labs/" + id + "_" + file.getOriginalFilename();
        lr.setReportUrl(url);
        lr.setUpdatedAt(LocalDateTime.now());
        repo.save(lr);
        return url;
    }

    public List<String> getCatalog() {
        return List.of("Complete Blood Count (CBC)", "Basic Metabolic Panel", "Lipid Panel", "Liver Panel");
    }

    private LabRequest findById(String id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
}