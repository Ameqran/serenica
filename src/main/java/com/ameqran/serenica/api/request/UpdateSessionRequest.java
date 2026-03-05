package com.ameqran.serenica.api.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateSessionRequest(
        @NotNull(message = "Patient id is required")
        UUID patientId,

        UUID bookingId,

        @NotNull(message = "Session number is required")
        @Min(value = 1, message = "Session number must be >= 1")
        Integer sessionNumber,

        @NotNull(message = "Session time is required")
        LocalDateTime occurredAt,

        @NotNull(message = "Duration is required")
        @Min(value = 15, message = "Duration must be at least 15 minutes")
        Integer durationMinutes,

        @Size(max = 120)
        String focusArea,

        @Min(0)
        @Max(27)
        Integer phq9Score,

        @Min(0)
        @Max(21)
        Integer gad7Score,

        @Min(1)
        @Max(10)
        Integer moodScore,

        @Size(max = 160)
        String riskSummary,

        String summary
) {
}
