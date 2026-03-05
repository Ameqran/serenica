package com.ameqran.serenica.service;

import com.ameqran.serenica.api.dto.BookingDto;
import com.ameqran.serenica.api.request.CreateBookingRequest;
import com.ameqran.serenica.api.request.UpdateBookingRequest;
import com.ameqran.serenica.common.NotFoundException;
import com.ameqran.serenica.domain.model.Booking;
import com.ameqran.serenica.domain.model.Patient;
import com.ameqran.serenica.domain.repository.BookingRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PatientService patientService;

    @Transactional(readOnly = true)
    public List<BookingDto> list(LocalDate date) {
        LocalDate target = date == null ? LocalDate.now() : date;
        LocalDateTime from = target.atStartOfDay();
        LocalDateTime to = from.plusDays(1);

        return bookingRepository.findByStartsAtBetweenOrderByStartsAtAsc(from, to)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public BookingDto create(CreateBookingRequest request) {
        Patient patient = patientService.findPatient(request.patientId());

        Booking booking = Booking.builder()
                .patient(patient)
                .startsAt(request.startsAt())
                .durationMinutes(request.durationMinutes())
                .sessionType(request.sessionType())
                .status(request.status())
                .location(request.location())
                .notes(request.notes())
                .build();

        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto update(UUID id, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        booking.setPatient(patientService.findPatient(request.patientId()));
        booking.setStartsAt(request.startsAt());
        booking.setDurationMinutes(request.durationMinutes());
        booking.setSessionType(request.sessionType());
        booking.setStatus(request.status());
        booking.setLocation(request.location());
        booking.setNotes(request.notes());

        return toDto(bookingRepository.save(booking));
    }

    public Booking findBooking(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + id));
    }

    public BookingDto toDto(Booking booking) {
        return new BookingDto(
                booking.getId(),
                booking.getPatient().getId(),
                booking.getPatient().getFirstName() + " " + booking.getPatient().getLastName(),
                booking.getStartsAt(),
                booking.getDurationMinutes(),
                booking.getSessionType(),
                booking.getStatus(),
                booking.getLocation(),
                booking.getNotes()
        );
    }
}
