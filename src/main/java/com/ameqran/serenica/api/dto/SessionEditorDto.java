package com.ameqran.serenica.api.dto;

import java.util.List;

public record SessionEditorDto(
        SessionDto session,
        List<ManualNoteDto> notes
) {
}
