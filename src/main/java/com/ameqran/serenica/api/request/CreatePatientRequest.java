package com.ameqran.serenica.api.request;

import com.ameqran.serenica.domain.enumtype.RiskLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePatientRequest(
        @NotBlank(message = "Patient code is required")
        @Size(max = 30)
        String code,

        @NotBlank(message = "First name is required")
        @Size(max = 80)
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 80)
        String lastName,

        @Size(max = 120)
        String email,

        @Size(max = 40)
        String phone,

        @Size(max = 160)
        String primaryConcern,

        @Size(max = 120)
        String therapyApproach,

        @NotNull(message = "Risk level is required")
        RiskLevel riskLevel,

        boolean active
) {
}
