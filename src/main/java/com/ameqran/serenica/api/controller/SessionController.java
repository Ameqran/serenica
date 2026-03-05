package com.ameqran.serenica.api.controller;

import com.ameqran.serenica.api.dto.ManualNoteDto;
import com.ameqran.serenica.api.dto.SessionDto;
import com.ameqran.serenica.api.dto.SessionEditorDto;
import com.ameqran.serenica.api.request.CreateSessionRequest;
import com.ameqran.serenica.api.request.UpdateManualNoteRequest;
import com.ameqran.serenica.api.request.UpdateSessionRequest;
import com.ameqran.serenica.service.NoteService;
import com.ameqran.serenica.service.SessionService;
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
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final NoteService noteService;

    @GetMapping
    public List<SessionDto> list(@RequestParam(required = false) UUID patientId) {
        return sessionService.list(patientId);
    }

    @GetMapping("/{id}")
    public SessionDto get(@PathVariable UUID id) {
        return sessionService.get(id);
    }

    @GetMapping("/{id}/editor")
    public SessionEditorDto editor(@PathVariable UUID id) {
        return sessionService.getEditor(id);
    }

    @PostMapping
    public SessionDto create(@Valid @RequestBody CreateSessionRequest request) {
        return sessionService.create(request);
    }

    @PutMapping("/{id}")
    public SessionDto update(@PathVariable UUID id, @Valid @RequestBody UpdateSessionRequest request) {
        return sessionService.update(id, request);
    }

    @PostMapping("/{id}/notes")
    public ManualNoteDto createNoteForSession(@PathVariable UUID id, @Valid @RequestBody UpdateManualNoteRequest request) {
        return noteService.createForSession(id, request);
    }
}
