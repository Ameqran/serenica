package com.ameqran.serenica.service;

import com.ameqran.serenica.api.dto.BookingDto;
import com.ameqran.serenica.api.dto.DashboardDto;
import com.ameqran.serenica.api.dto.DashboardMetricsDto;
import com.ameqran.serenica.api.dto.ManualNoteDto;
import com.ameqran.serenica.domain.repository.BookingRepository;
import com.ameqran.serenica.domain.repository.ManualNoteRepository;
import com.ameqran.serenica.domain.repository.PatientRepository;
import com.ameqran.serenica.domain.repository.SessionRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final BookingRepository bookingRepository;
    private final SessionRepository sessionRepository;
    private final ManualNoteRepository manualNoteRepository;
    private final BookingService bookingService;
    private final NoteService noteService;

    @Transactional(readOnly = true)
    public DashboardDto getOverview() {
        LocalDateTime dayStart = LocalDate.now().atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);

        LocalDate startOfWeekDate = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDateTime startOfWeek = LocalDateTime.of(startOfWeekDate, LocalTime.MIN);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);

        DashboardMetricsDto metrics = new DashboardMetricsDto(
                patientRepository.countByActiveTrue(),
                bookingRepository.countByStartsAtBetween(dayStart, dayEnd),
                manualNoteRepository.countBySignedFalse(),
                sessionRepository.countByOccurredAtBetween(startOfWeek, endOfWeek)
        );

        List<BookingDto> todayBookings = bookingRepository.findByStartsAtBetweenOrderByStartsAtAsc(dayStart, dayEnd)
                .stream()
                .map(bookingService::toDto)
                .toList();

        List<ManualNoteDto> recentNotes = noteService.listRecent();

        return new DashboardDto(metrics, todayBookings, recentNotes);
    }
}
