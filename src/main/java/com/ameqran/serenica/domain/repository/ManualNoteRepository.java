package com.ameqran.serenica.domain.repository;

import com.ameqran.serenica.domain.enumtype.NoteFormat;
import com.ameqran.serenica.domain.model.ManualNote;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ManualNoteRepository extends JpaRepository<ManualNote, UUID> {

    long countBySignedFalse();

    List<ManualNote> findTop8ByOrderByCreatedAtDesc();

    List<ManualNote> findBySessionIdOrderByCreatedAtDesc(UUID sessionId);

    @Query("""
        select n from ManualNote n
        join fetch n.patient p
        where (:patientId is null or p.id = :patientId)
          and (:signed is null or n.signed = :signed)
          and (:format is null or n.format = :format)
          and (
              :search is null
              or lower(n.title) like lower(concat('%', :search, '%'))
              or lower(n.content) like lower(concat('%', :search, '%'))
              or lower(concat(p.firstName, ' ', p.lastName)) like lower(concat('%', :search, '%'))
          )
        order by n.createdAt desc
        """)
    List<ManualNote> search(
            @Param("patientId") UUID patientId,
            @Param("signed") Boolean signed,
            @Param("format") NoteFormat format,
            @Param("search") String search
    );
}
