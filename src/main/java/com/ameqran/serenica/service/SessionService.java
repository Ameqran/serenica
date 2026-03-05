package com.ameqran.serenica.service;

import com.ameqran.serenica.api.dto.ManualNoteDto;
import com.ameqran.serenica.api.dto.SessionDto;
import com.ameqran.serenica.api.dto.SessionEditorDto;
import com.ameqran.serenica.api.request.CreateSessionRequest;
import com.ameqran.serenica.api.request.UpdateSessionRequest;
import com.ameqran.serenica.common.NotFoundException;
import com.ameqran.serenica.domain.model.Booking;
import com.ameqran.serenica.domain.model.Patient;
import com.ameqran.serenica.domain.model.Session;
import com.ameqran.serenica.domain.repository.SessionRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final PatientService patientService;
    private final BookingService bookingService;
    private final NoteService noteService;

    @Transactional(readOnly = true)
    public List<SessionDto> list(UUID patientId) {
        List<Session> sessions = patientId == null
                ? sessionRepository.findAllByOrderByOccurredAtDesc()
                : sessionRepository.findByPatientIdOrderByOccurredAtDesc(patientId);

        return sessions.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public SessionDto get(UUID id) {
        return toDto(findSession(id));
    }

    @Transactional(readOnly = true)
    public SessionEditorDto getEditor(UUID sessionId) {
        Session session = findSession(sessionId);
        List<ManualNoteDto> notes = noteService.listBySession(sessionId);
        return new SessionEditorDto(toDto(session), notes);
    }

    @Transactional
    public SessionDto create(CreateSessionRequest request) {
        Patient patient = patientService.findPatient(request.patientId());
        Booking booking = request.bookingId() == null ? null : bookingService.findBooking(request.bookingId());

        Session session = Session.builder()
                .patient(patient)
                .booking(booking)
                .sessionNumber(request.sessionNumber())
                .occurredAt(request.occurredAt())
                .durationMinutes(request.durationMinutes())
                .focusArea(request.focusArea())
                .phq9Score(request.phq9Score())
                .gad7Score(request.gad7Score())
                .moodScore(request.moodScore())
                .riskSummary(request.riskSummary())
                .summary(request.summary())
                .build();

        return toDto(sessionRepository.save(session));
    }

    @Transactional
    public SessionDto update(UUID id, UpdateSessionRequest request) {
        Session session = findSession(id);

        session.setPatient(patientService.findPatient(request.patientId()));
        session.setBooking(request.bookingId() == null ? null : bookingService.findBooking(request.bookingId()));
        session.setSessionNumber(request.sessionNumber());
        session.setOccurredAt(request.occurredAt());
        session.setDurationMinutes(request.durationMinutes());
        session.setFocusArea(request.focusArea());
        session.setPhq9Score(request.phq9Score());
        session.setGad7Score(request.gad7Score());
        session.setMoodScore(request.moodScore());
        session.setRiskSummary(request.riskSummary());
        session.setSummary(request.summary());

        return toDto(sessionRepository.save(session));
    }

    public Session findSession(UUID id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Session not found: " + id));
    }

    public SessionDto toDto(Session session) {
        return new SessionDto(
                session.getId(),
                session.getPatient().getId(),
                session.getPatient().getFirstName() + " " + session.getPatient().getLastName(),
                session.getBooking() != null ? session.getBooking().getId() : null,
                session.getSessionNumber(),
                session.getOccurredAt(),
                session.getDurationMinutes(),
                session.getFocusArea(),
                session.getPhq9Score(),
                session.getGad7Score(),
                session.getMoodScore(),
                session.getRiskSummary(),
                session.getSummary()
        );
    }
}
