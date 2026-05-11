package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.Goal;
import com.example.appraisal_system.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // ✅ 1. CREATE GOAL (Manager assigns)
    @PostMapping("/employee/{empId}/cycle/{cycleId}")
    @PreAuthorize("hasRole('MANAGER')")
    public Goal createGoal(@PathVariable Long empId,
                           @PathVariable Long cycleId,
                           @RequestBody Goal goal) {

        return goalService.createGoal(empId, cycleId, goal);
    }

    // ✅ 2. GET ALL GOALS
    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'MANAGER')")
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }

    // ✅ 3. GET GOALS BY EMPLOYEE
    @GetMapping("/employee/{empId}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'EMPLOYEE')")
    public List<Goal> getGoalsByEmployee(@PathVariable Long empId) {
        return goalService.getGoalsByEmployee(empId);
    }

    @GetMapping("/cycle/{cycleId}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER')")
    public List<Goal> getGoalsByCycle(@PathVariable Long cycleId) {
        return goalService.getGoalsByCycle(cycleId);
    }

    // ✅ NEW: GET GOALS BY USER ID (Resolves Employee by User's email)
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'EMPLOYEE')")
    public List<Goal> getGoalsByUserId(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    // ✅ 5. GET GOALS BY MANAGER (only goals for employees under this manager)
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Goal> getGoalsByManager(@RequestParam String managerName) {
        return goalService.getGoalsByManagerName(managerName);
    }

    // ✅ 6. UPDATE FULL GOAL (Employee side)
    @PutMapping("/{goalId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Goal updateGoal(@PathVariable Long goalId,
                           @RequestBody Goal updatedGoal) {

        return goalService.updateGoalFromEmployee(goalId, updatedGoal);
    }

    // ✅ 7. EMPLOYEE SUBMITS TARGET (changes status to SUBMITTED + notifies manager)
    @PutMapping("/{goalId}/submit")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Goal submitGoal(@PathVariable Long goalId,
                           @RequestBody Goal updatedGoal) {
        return goalService.submitGoal(goalId, updatedGoal);
    }

    // ✅ 8. UPDATE ONLY STATUS (Manager shortcut)
    @PutMapping("/{goalId}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public Goal updateStatus(@PathVariable Long goalId,
                             @RequestParam String status) {

        return goalService.updateStatus(goalId, status);
    }

    // ✅ 9. DELETE GOAL
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public String deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return "Goal deleted successfully!";
    }
}