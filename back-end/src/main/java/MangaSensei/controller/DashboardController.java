package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.dashboard.DashboardResponseDTO;
import MangaSensei.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> apresentarDashboard(Authentication authentication) {
        DashboardResponseDTO dashboard = dashboardService.apresentarDashboard(Long.valueOf(authentication.getName()));

        return ResponseEntity.ok(dashboard);
    }
}
