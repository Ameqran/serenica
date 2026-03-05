package com.ameqran.serenica.api.dto;

import java.util.List;

public record DashboardDto(
        DashboardMetricsDto metrics,
        List<BookingDto> todayBookings,
        List<ManualNoteDto> recentNotes
) {
}
