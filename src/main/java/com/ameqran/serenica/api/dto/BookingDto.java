package com.ameqran.serenica.api.dto;

import com.ameqran.serenica.domain.enumtype.BookingStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record BookingDto(
        UUID id,
        UUID patientId,
        String patientName,
        LocalDateTime startsAt,
        Integer durationMinutes,
        String sessionType,
        BookingStatus status,
        String location,
        String notes
) {
}
