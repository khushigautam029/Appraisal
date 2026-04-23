package com.example.appraisal_system.controller;

import com.example.appraisal_system.dto.ManagerReportDTO;
import com.example.appraisal_system.dto.TeamMemberDTO;
import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    // 🔹 Dashboard API (Summary Stats)
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(@RequestParam String managerName, @RequestParam(required = false) Long cycleId) {
        Map<String, Object> data = new HashMap<>();

        if (cycleId == null) {
            data.put("employees", managerService.getMyEmployees(managerName).size());
            data.put("pending", 0);
            data.put("completed", 0);
        } else {
            data.put("employees", managerService.getMyEmployees(managerName).size());
            data.put("pending", managerService.getPendingReviewsCount(managerName, cycleId));
            data.put("completed", managerService.getCompletedReviewsCount(managerName, cycleId));
        }

        return data;
    }

    // 🔹 Get Team Status for a specific cycle
    @GetMapping("/team-status")
    public List<TeamMemberDTO> getTeamStatus(@RequestParam String managerName, @RequestParam Long cycleId) {
        return managerService.getTeamStatus(managerName, cycleId);
    }

    // 🔹 Get Detailed Reports for a specific cycle
    @GetMapping("/reports")
    public List<ManagerReportDTO> getReports(@RequestParam String managerName, @RequestParam Long cycleId) {
        return managerService.getManagerReports(managerName, cycleId);
    }

    // 🔹 Legacy Get Employees (Team Overview)
    @GetMapping("/employees")
    public List<Employee> getEmployees(@RequestParam String managerName) {
        return managerService.getMyEmployees(managerName);
    }

    // 🔹 Assign Target
    @PostMapping("/assign-target")
    public String assignTarget(@RequestBody Goal goal) {
        managerService.assignGoal(goal);
        return "Target Assigned Successfully";
    }

    // 🔹 Delete Target
    @DeleteMapping("/goal/{id}")
    public String deleteGoal(@PathVariable Long id) {
        managerService.deleteGoal(id);
        return "Goal Deleted";
    }
}