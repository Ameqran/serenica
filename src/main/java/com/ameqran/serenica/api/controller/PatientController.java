package com.ameqran.serenica.api.controller;

import com.ameqran.serenica.api.dto.PatientDto;
import com.ameqran.serenica.api.request.CreatePatientRequest;
import com.ameqran.serenica.api.request.UpdatePatientRequest;
import com.ameqran.serenica.service.PatientService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public List<PatientDto> list(@RequestParam(required = false) String search) {
        return patientService.list(search);
    }

    @GetMapping("/{id}")
    public PatientDto get(@PathVariable UUID id) {
        return patientService.get(id);
    }

    @PostMapping
    public PatientDto create(@Valid @RequestBody CreatePatientRequest request) {
        return patientService.create(request);
    }

    @PutMapping("/{id}")
    public PatientDto update(@PathVariable UUID id, @Valid @RequestBody UpdatePatientRequest request) {
        return patientService.update(id, request);
    }
}
