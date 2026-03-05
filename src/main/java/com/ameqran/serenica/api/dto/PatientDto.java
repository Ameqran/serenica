package com.ameqran.serenica.api.dto;

import com.ameqran.serenica.domain.enumtype.RiskLevel;
import java.time.LocalDateTime;
import java.util.UUID;

public record PatientDto(
        UUID id,
        String code,
        String firstName,
        String lastName,
        String fullName,
        String primaryConcern,
        String therapyApproach,
        RiskLevel riskLevel,
        boolean active,
        long sessionCount,
        LocalDateTime nextBookingAt,
        LocalDateTime lastSessionAt
) {
}
