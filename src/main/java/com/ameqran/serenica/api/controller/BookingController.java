package com.ameqran.serenica.api.controller;

import com.ameqran.serenica.api.dto.BookingDto;
import com.ameqran.serenica.api.request.CreateBookingRequest;
import com.ameqran.serenica.api.request.UpdateBookingRequest;
import com.ameqran.serenica.service.BookingService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public List<BookingDto> list(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return bookingService.list(date);
    }

    @PostMapping
    public BookingDto create(@Valid @RequestBody CreateBookingRequest request) {
        return bookingService.create(request);
    }

    @PutMapping("/{id}")
    public BookingDto update(@PathVariable UUID id, @Valid @RequestBody UpdateBookingRequest request) {
        return bookingService.update(id, request);
    }
}
