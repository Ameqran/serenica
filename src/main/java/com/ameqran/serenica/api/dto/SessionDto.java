package com.ameqran.serenica.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SessionDto(
        UUID id,
        UUID patientId,
        String patientName,
        UUID bookingId,
        Integer sessionNumber,
        LocalDateTime occurredAt,
        Integer durationMinutes,
        String focusArea,
        Integer phq9Score,
        Integer gad7Score,
        Integer moodScore,
        String riskSummary,
        String summary
) {
}
