package com.ameqran.serenica.domain.repository;

import com.ameqran.serenica.domain.model.Booking;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    long countByStartsAtBetween(LocalDateTime from, LocalDateTime to);

    List<Booking> findByStartsAtBetweenOrderByStartsAtAsc(LocalDateTime from, LocalDateTime to);

    Optional<Booking> findFirstByPatientIdAndStartsAtAfterOrderByStartsAtAsc(UUID patientId, LocalDateTime startsAfter);

    List<Booking> findByPatientIdOrderByStartsAtDesc(UUID patientId);
}
