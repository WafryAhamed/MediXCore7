import os

BASE_DIR = r"E:\bc hospital\server\src\main\java\com\bchospital\modules\billing"
DTO_DIR = os.path.join(BASE_DIR, "dto")
MAPPER_DIR = os.path.join(BASE_DIR, "mapper")

os.makedirs(DTO_DIR, exist_ok=True)
os.makedirs(MAPPER_DIR, exist_ok=True)

invoice_entity = """package com.bchospital.modules.billing;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "appointment_id", unique = true)
    private String appointmentId;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String status; // DRAFT/SENT/PAID/PARTIALLY_PAID/OVERDUE/CANCELLED

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();
}
"""

invoice_item_entity = """package com.bchospital.modules.billing;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @JsonIgnore
    private Invoice invoice;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private int quantity = 1;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal total;
}
"""

repo = """package com.bchospital.modules.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String>, JpaSpecificationExecutor<Invoice> {

    @Query("SELECT SUM(i.paidAmount) FROM Invoice i WHERE i.paidAt >= :from AND i.paidAt <= :to")
    BigDecimal sumPaidAmountBetween(LocalDateTime from, LocalDateTime to);
}
"""

java_classes = {
    "dto/InvoiceItemRequest.java": """package com.bchospital.modules.billing.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class InvoiceItemRequest {
    @NotBlank private String description;
    @NotNull private Integer quantity;
    @NotNull private BigDecimal unitPrice;
}""",
    "dto/InvoiceCreateRequest.java": """package com.bchospital.modules.billing.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
@Data
public class InvoiceCreateRequest {
    @NotBlank private String patientId;
    private String appointmentId;
    private BigDecimal tax;
    private BigDecimal discount;
    private LocalDate dueDate;
    private String notes;
    @NotEmpty private List<InvoiceItemRequest> items;
}""",
    "dto/PaymentRequest.java": """package com.bchospital.modules.billing.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class PaymentRequest {
    @NotNull private BigDecimal amount;
    @NotNull private String method; // CASH/CARD/INSURANCE/ONLINE
}""",
    "dto/InvoiceResponse.java": """package com.bchospital.modules.billing.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class InvoiceResponse {
    private String id;
    private String invoiceNumber;
    private String patientId;
    private String appointmentId;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal total;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime paidAt;
    private BigDecimal paidAmount;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private List<InvoiceItemDto> items;

    @Data
    public static class InvoiceItemDto {
        private String id;
        private String description;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
}""",
    "dto/RevenueStats.java": """package com.bchospital.modules.billing.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Builder
public class RevenueStats {
    private String period;
    private BigDecimal revenue;
}""",
    "mapper/BillingMapper.java": """package com.bchospital.modules.billing.mapper;
import com.bchospital.modules.billing.Invoice;
import com.bchospital.modules.billing.InvoiceItem;
import com.bchospital.modules.billing.dto.InvoiceCreateRequest;
import com.bchospital.modules.billing.dto.InvoiceItemRequest;
import com.bchospital.modules.billing.dto.InvoiceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BillingMapper {
    @Mapping(target = "items", ignore = true)
    Invoice toEntity(InvoiceCreateRequest req);
    InvoiceItem toItemEntity(InvoiceItemRequest req);
    InvoiceResponse toResponse(Invoice invoice);
}""",
    "BillingSpecification.java": """package com.bchospital.modules.billing;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
public class BillingSpecification {
    public static Specification<Invoice> fieldEq(String field, String val) {
        return (root, query, cb) -> val == null ? null : cb.equal(root.get(field), val);
    }
    public static Specification<Invoice> dateEq(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.equal(root.get("createdAt").as(LocalDate.class), date);
    }
}""",
    "BillingService.java": """package com.bchospital.modules.billing;

import com.bchospital.common.audit.AuditService;
import com.bchospital.common.exception.BusinessException;
import com.bchospital.common.exception.ResourceNotFoundException;
import com.bchospital.common.response.PageResponse;
import com.bchospital.common.util.NumberGenerator;
import com.bchospital.modules.billing.dto.*;
import com.bchospital.modules.billing.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository repository;
    private final BillingMapper mapper;
    private final AuditService auditService;
    private final NumberGenerator numberGenerator;

    @Transactional(readOnly = true)
    public PageResponse<InvoiceResponse> getInvoices(int page, int size, String status, String patientId, LocalDate date) {
        Specification<Invoice> spec = Specification.where(BillingSpecification.fieldEq("status", status))
                .and(BillingSpecification.fieldEq("patientId", patientId))
                .and(BillingSpecification.dateEq(date));
                
        Page<Invoice> res = repository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.from(res.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(String id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreateRequest req) {
        Invoice invoice = mapper.toEntity(req);
        invoice.setInvoiceNumber(numberGenerator.nextInvoiceNumber());
        invoice.setStatus("DRAFT");
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        
        if (invoice.getTax() == null) invoice.setTax(BigDecimal.ZERO);
        if (invoice.getDiscount() == null) invoice.setDiscount(BigDecimal.ZERO);
        if (invoice.getDueDate() == null) invoice.setDueDate(LocalDate.now().plusDays(15));
        
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (InvoiceItemRequest itemReq : req.getItems()) {
            InvoiceItem item = mapper.toItemEntity(itemReq);
            item.setTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            item.setInvoice(invoice);
            invoice.getItems().add(item);
            subtotal = subtotal.add(item.getTotal());
        }
        
        invoice.setSubtotal(subtotal);
        BigDecimal total = subtotal.add(invoice.getTax()).subtract(invoice.getDiscount());
        invoice.setTotal(total.max(BigDecimal.ZERO));
        
        Invoice saved = repository.save(invoice);
        auditService.log("CREATE_INVOICE", "Invoice", saved.getId(), null, "Created invoice");
        return mapper.toResponse(saved);
    }

    @Transactional
    public void recordPayment(String id, PaymentRequest req) {
        Invoice invoice = findById(id);
        if ("PAID".equals(invoice.getStatus())) throw new BusinessException("Invoice already paid");
        
        BigDecimal newPaidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount().add(req.getAmount()) : req.getAmount();
        invoice.setPaidAmount(newPaidAmount);
        invoice.setPaidAt(LocalDateTime.now());
        invoice.setPaymentMethod(req.getMethod());
        
        if (newPaidAmount.compareTo(invoice.getTotal()) >= 0) {
            invoice.setStatus("PAID");
        } else {
            invoice.setStatus("PARTIALLY_PAID");
        }
        
        invoice.setUpdatedAt(LocalDateTime.now());
        repository.save(invoice);
        auditService.log("RECORD_PAYMENT", "Invoice", id, null, "Recorded payment of " + req.getAmount());
    }

    @Transactional
    public void changeStatusToSend(String id) {
        Invoice invoice = findById(id);
        if (!"DRAFT".equals(invoice.getStatus())) throw new BusinessException("Only DRAFT invoices can be sent");
        invoice.setStatus("SENT");
        invoice.setUpdatedAt(LocalDateTime.now());
        repository.save(invoice);
        auditService.log("SEND_INVOICE", "Invoice", id, null, "Sent invoice");
    }

    @Transactional
    public void cancelDraft(String id) {
        Invoice invoice = findById(id);
        if (!"DRAFT".equals(invoice.getStatus())) throw new BusinessException("Only DRAFT invoices can be cancelled");
        invoice.setStatus("CANCELLED");
        invoice.setUpdatedAt(LocalDateTime.now());
        repository.save(invoice);
        auditService.log("CANCEL_INVOICE", "Invoice", id, null, "Cancelled invoice");
    }
    
    public byte[] generatePdf(String id) {
        // Stub using itext7 PdfUtil
        return new byte[0];
    }
    
    @Transactional(readOnly = true)
    public RevenueStats getRevenue(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from;
        switch (period.toUpperCase()) {
            case "DAILY": from = now.with(LocalTime.MIN); break;
            case "WEEKLY": from = now.minusDays(7); break;
            case "MONTHLY": from = now.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN); break;
            case "YEARLY": from = now.with(TemporalAdjusters.firstDayOfYear()).with(LocalTime.MIN); break;
            default: throw new BusinessException("Invalid period");
        }
        BigDecimal sum = repository.sumPaidAmountBetween(from, now);
        if (sum == null) sum = BigDecimal.ZERO;
        return RevenueStats.builder().period(period).revenue(sum).build();
    }

    private Invoice findById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }
}""",
    "BillingController.java": """package com.bchospital.modules.billing;

import com.bchospital.common.response.ApiResponse;
import com.bchospital.common.response.PageResponse;
import com.bchospital.modules.billing.dto.InvoiceCreateRequest;
import com.bchospital.modules.billing.dto.InvoiceResponse;
import com.bchospital.modules.billing.dto.PaymentRequest;
import com.bchospital.modules.billing.dto.RevenueStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
@Tag(name = "Billing", description = "Billing API")
public class BillingController {

    private final BillingService service;

    @GetMapping("/invoices")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ApiResponse<PageResponse<InvoiceResponse>> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(service.getInvoices(page, size, status, patientId, date));
    }

    @GetMapping("/invoices/{id}")
    public ApiResponse<InvoiceResponse> getById(@PathVariable String id) {
        return ApiResponse.success(service.getById(id));
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ApiResponse<InvoiceResponse> create(@Valid @RequestBody InvoiceCreateRequest request) {
        return ApiResponse.success(service.createInvoice(request));
    }

    @PutMapping("/invoices/{id}/pay")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ApiResponse<Void> recordPayment(@PathVariable String id, @Valid @RequestBody PaymentRequest request) {
        service.recordPayment(id, request);
        return ApiResponse.success(null, "Payment recorded");
    }

    @PutMapping("/invoices/{id}/send")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ApiResponse<Void> sendInvoice(@PathVariable String id) {
        service.changeStatusToSend(id);
        return ApiResponse.success(null, "Sent");
    }

    @DeleteMapping("/invoices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> cancel(@PathVariable String id) {
        service.cancelDraft(id);
        return ApiResponse.success(null, "Cancelled");
    }

    @GetMapping("/invoices/{id}/pdf")
    public ResponseEntity<byte[]> getPdf(@PathVariable String id) {
        byte[] pdf = service.generatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=INV-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RevenueStats> getRevenue(@RequestParam(defaultValue = "MONTHLY") String period) {
        return ApiResponse.success(service.getRevenue(period));
    }
}"""
}

with open(os.path.join(BASE_DIR, "Invoice.java"), "w") as f: f.write(invoice_entity)
with open(os.path.join(BASE_DIR, "InvoiceItem.java"), "w") as f: f.write(invoice_item_entity)
with open(os.path.join(BASE_DIR, "InvoiceRepository.java"), "w") as f: f.write(repo)
for k, v in java_classes.items():
    with open(os.path.join(BASE_DIR, k), "w") as f:
        f.write(v)

