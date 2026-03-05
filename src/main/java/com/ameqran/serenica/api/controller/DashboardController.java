package com.ameqran.serenica.api.controller;

import com.ameqran.serenica.api.dto.DashboardDto;
import com.ameqran.serenica.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public DashboardDto overview() {
        return dashboardService.getOverview();
    }
}
