package com.ameqran.serenica.service;

import com.ameqran.serenica.api.dto.PatientDto;
import com.ameqran.serenica.api.request.CreatePatientRequest;
import com.ameqran.serenica.api.request.UpdatePatientRequest;
import com.ameqran.serenica.common.NotFoundException;
import com.ameqran.serenica.domain.model.Patient;
import com.ameqran.serenica.domain.repository.BookingRepository;
import com.ameqran.serenica.domain.repository.PatientRepository;
import com.ameqran.serenica.domain.repository.SessionRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final SessionRepository sessionRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<PatientDto> list(String search) {
        List<Patient> patients = (search == null || search.isBlank())
                ? patientRepository.findAllByOrderByLastNameAscFirstNameAsc()
                : patientRepository.search(search.trim());

        return patients.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public PatientDto get(UUID id) {
        return toDto(findPatient(id));
    }

    @Transactional
    public PatientDto create(CreatePatientRequest request) {
        Patient saved = patientRepository.save(Patient.builder()
                .code(request.code().trim())
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(request.email())
                .phone(request.phone())
                .primaryConcern(request.primaryConcern())
                .therapyApproach(request.therapyApproach())
                .riskLevel(request.riskLevel())
                .active(request.active())
                .build());

        return toDto(saved);
    }

    @Transactional
    public PatientDto update(UUID id, UpdatePatientRequest request) {
        Patient patient = findPatient(id);

        patient.setCode(request.code().trim());
        patient.setFirstName(request.firstName().trim());
        patient.setLastName(request.lastName().trim());
        patient.setEmail(request.email());
        patient.setPhone(request.phone());
        patient.setPrimaryConcern(request.primaryConcern());
        patient.setTherapyApproach(request.therapyApproach());
        patient.setRiskLevel(request.riskLevel());
        patient.setActive(request.active());

        return toDto(patientRepository.save(patient));
    }

    public Patient findPatient(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient not found: " + id));
    }

    private PatientDto toDto(Patient patient) {
        UUID patientId = patient.getId();
        long sessionCount = sessionRepository.countByPatientId(patientId);
        LocalDateTime nextBooking = bookingRepository.findFirstByPatientIdAndStartsAtAfterOrderByStartsAtAsc(patientId, LocalDateTime.now())
                .map(booking -> booking.getStartsAt())
                .orElse(null);
        LocalDateTime lastSession = sessionRepository.findTopByPatientIdOrderByOccurredAtDesc(patientId)
                .map(session -> session.getOccurredAt())
                .orElse(null);

        return new PatientDto(
                patient.getId(),
                patient.getCode(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getFirstName() + " " + patient.getLastName(),
                patient.getPrimaryConcern(),
                patient.getTherapyApproach(),
                patient.getRiskLevel(),
                patient.isActive(),
                sessionCount,
                nextBooking,
                lastSession
        );
    }
}
