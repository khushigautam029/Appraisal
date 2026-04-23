package com.example.appraisal_system.controller;

import com.example.appraisal_system.dto.DashboardResponse;
import com.example.appraisal_system.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/user/{userId}/cycle/{cycleId}")
    public DashboardResponse getDashboard(@PathVariable Long userId,
                                          @PathVariable Long cycleId) {
        return dashboardService.getDashboardByUserId(userId, cycleId);
    }
}