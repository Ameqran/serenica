package com.ameqran.serenica.api.request;

import com.ameqran.serenica.domain.enumtype.BookingStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateBookingRequest(
        @NotNull(message = "Patient id is required")
        UUID patientId,

        @NotNull(message = "Booking start time is required")
        LocalDateTime startsAt,

        @NotNull(message = "Duration is required")
        @Min(value = 15, message = "Duration must be at least 15 minutes")
        Integer durationMinutes,

        @NotBlank(message = "Session type is required")
        @Size(max = 120)
        String sessionType,

        @NotNull(message = "Status is required")
        BookingStatus status,

        @Size(max = 100)
        String location,

        String notes
) {
}
