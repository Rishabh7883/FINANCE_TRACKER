package com.tracker.controller;

import com.tracker.dto.DashboardSummaryDto;
import com.tracker.security.UserPrincipal;
import com.tracker.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(userPrincipal);
        return ResponseEntity.ok(summary);
    }
}
