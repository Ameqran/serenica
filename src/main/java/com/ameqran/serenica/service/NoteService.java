package com.ameqran.serenica.service;

import com.ameqran.serenica.api.dto.ManualNoteDto;
import com.ameqran.serenica.api.request.CreateManualNoteRequest;
import com.ameqran.serenica.api.request.UpdateManualNoteRequest;
import com.ameqran.serenica.common.NotFoundException;
import com.ameqran.serenica.domain.enumtype.NoteFormat;
import com.ameqran.serenica.domain.model.ManualNote;
import com.ameqran.serenica.domain.model.Patient;
import com.ameqran.serenica.domain.model.Session;
import com.ameqran.serenica.domain.repository.ManualNoteRepository;
import com.ameqran.serenica.domain.repository.SessionRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final ManualNoteRepository manualNoteRepository;
    private final PatientService patientService;
    private final SessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public List<ManualNoteDto> list(UUID patientId, Boolean signed, NoteFormat format, String search) {
        String term = (search == null || search.isBlank()) ? null : search.trim();
        return manualNoteRepository.search(patientId, signed, format, term)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ManualNoteDto> listRecent() {
        return manualNoteRepository.findTop8ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ManualNoteDto> listBySession(UUID sessionId) {
        return manualNoteRepository.findBySessionIdOrderByCreatedAtDesc(sessionId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ManualNoteDto create(CreateManualNoteRequest request) {
        Patient patient = patientService.findPatient(request.patientId());
        Session session = request.sessionId() == null ? null : findSession(request.sessionId());

        ManualNote note = ManualNote.builder()
                .patient(patient)
                .session(session)
                .title(request.title())
                .format(request.format())
                .content(request.content())
                .signed(request.signed())
                .aiDrafted(request.aiDrafted())
                .build();

        return toDto(manualNoteRepository.save(note));
    }

    @Transactional
    public ManualNoteDto createForSession(UUID sessionId, UpdateManualNoteRequest request) {
        Session session = findSession(sessionId);

        ManualNote note = ManualNote.builder()
                .patient(session.getPatient())
                .session(session)
                .title(request.title())
                .format(request.format())
                .content(request.content())
                .signed(request.signed())
                .aiDrafted(request.aiDrafted())
                .build();

        return toDto(manualNoteRepository.save(note));
    }

    private Session findSession(UUID id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Session not found: " + id));
    }

    @Transactional
    public ManualNoteDto update(UUID id, UpdateManualNoteRequest request) {
        ManualNote note = manualNoteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Note not found: " + id));

        note.setTitle(request.title());
        note.setFormat(request.format());
        note.setContent(request.content());
        note.setSigned(request.signed());
        note.setAiDrafted(request.aiDrafted());

        return toDto(manualNoteRepository.save(note));
    }

    public ManualNoteDto toDto(ManualNote note) {
        return new ManualNoteDto(
                note.getId(),
                note.getPatient().getId(),
                note.getPatient().getFirstName() + " " + note.getPatient().getLastName(),
                note.getSession() != null ? note.getSession().getId() : null,
                note.getTitle(),
                note.getFormat(),
                note.getContent(),
                note.isSigned(),
                note.isAiDrafted(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
