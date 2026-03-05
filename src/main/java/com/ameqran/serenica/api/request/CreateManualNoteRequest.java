package com.ameqran.serenica.api.request;

import com.ameqran.serenica.domain.enumtype.NoteFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateManualNoteRequest(
        @NotNull(message = "Patient id is required")
        UUID patientId,

        UUID sessionId,

        @NotBlank(message = "Note title is required")
        @Size(max = 200)
        String title,

        @NotNull(message = "Note format is required")
        NoteFormat format,

        @NotBlank(message = "Note content is required")
        String content,

        boolean signed,

        boolean aiDrafted
) {
}
