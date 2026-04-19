package com.bchospital.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NumberGenerator {

    private final JdbcTemplate jdbcTemplate;

    public String nextPatientNumber() {
        return "PAT-" + getNextSequenceValue("seq_patient");
    }

    public String nextDoctorNumber() {
        return "DOC-" + getNextSequenceValue("seq_doctor");
    }

    public String nextAppointmentNumber() {
        return "APT-" + getNextSequenceValue("seq_appointment");
    }

    public String nextPrescriptionNumber() {
        return "RX-" + getNextSequenceValue("seq_prescription");
    }

    public String nextLabNumber() {
        return "LAB-" + getNextSequenceValue("seq_lab");
    }

    public String nextInvoiceNumber() {
        return "INV-" + getNextSequenceValue("seq_invoice");
    }

    private String getNextSequenceValue(String sequenceName) {
        Long value = jdbcTemplate.queryForObject("SELECT nextval('" + sequenceName + "')", Long.class);
        return String.format("%06d", value);
    }
}
