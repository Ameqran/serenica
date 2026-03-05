package com.ameqran.serenica.common;

import java.time.LocalDateTime;

public record ApiError(
        String message,
        LocalDateTime timestamp
) {
}
