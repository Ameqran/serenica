package com.ameqran.serenica.api.controller;

import com.ameqran.serenica.api.dto.ManualNoteDto;
import com.ameqran.serenica.api.request.CreateManualNoteRequest;
import com.ameqran.serenica.api.request.UpdateManualNoteRequest;
import com.ameqran.serenica.domain.enumtype.NoteFormat;
import com.ameqran.serenica.service.NoteService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<ManualNoteDto> list(
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) Boolean signed,
            @RequestParam(required = false) NoteFormat format,
            @RequestParam(required = false) String search
    ) {
        return noteService.list(patientId, signed, format, search);
    }

    @PostMapping
    public ManualNoteDto create(@Valid @RequestBody CreateManualNoteRequest request) {
        return noteService.create(request);
    }

    @PutMapping("/{id}")
    public ManualNoteDto update(@PathVariable UUID id, @Valid @RequestBody UpdateManualNoteRequest request) {
        return noteService.update(id, request);
    }
}
