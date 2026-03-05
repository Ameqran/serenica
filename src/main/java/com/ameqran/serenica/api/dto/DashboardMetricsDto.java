package com.ameqran.serenica.api.dto;

public record DashboardMetricsDto(
        long activePatients,
        long todayBookings,
        long unsignedNotes,
        long sessionsThisWeek
) {
}
