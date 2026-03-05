package com.ameqran.serenica.api.dto;

import com.ameqran.serenica.domain.enumtype.NoteFormat;
import java.time.LocalDateTime;
import java.util.UUID;

public record ManualNoteDto(
        UUID id,
        UUID patientId,
        String patientName,
        UUID sessionId,
        String title,
        NoteFormat format,
        String content,
        boolean signed,
        boolean aiDrafted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
