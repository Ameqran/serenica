package com.ameqran.serenica.domain.repository;

import com.ameqran.serenica.domain.model.Session;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, UUID> {

    long countByOccurredAtBetween(LocalDateTime from, LocalDateTime to);

    long countByPatientId(UUID patientId);

    Optional<Session> findTopByPatientIdOrderByOccurredAtDesc(UUID patientId);

    List<Session> findByPatientIdOrderByOccurredAtDesc(UUID patientId);

    List<Session> findAllByOrderByOccurredAtDesc();
}
