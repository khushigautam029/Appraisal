package com.example.appraisal_system.service;

import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AppraisalCycleRepository cycleRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ✅ CREATE GOAL (Manager assigns target to employee)
    public Goal createGoal(Long employeeId, Long cycleId, Goal goal) {

        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        AppraisalCycle cycle = cycleRepository.findById(cycleId).orElseThrow();

        goal.setEmployee(employee);
        goal.setCycle(cycle);

        // Default status is PENDING (assigned by manager, waiting for employee)
        if (goal.getStatus() == null) {
            goal.setStatus("PENDING");
        }

        Goal savedGoal = goalRepository.save(goal);

        // Notify the employee that a new target has been assigned
        // Find the user ID for this employee by email
        Optional<User> empUser = userRepository.findByEmail(employee.getEmail());
        if (empUser.isPresent()) {
            notificationService.createNotification(
                empUser.get().getId(),
                "EMPLOYEE",
                "📋 New target assigned: " + (goal.getDescription() != null ? goal.getDescription() : goal.getTitle()),
                "TARGET_ASSIGNED"
            );
        }

        return savedGoal;
    }

    // ✅ GET ALL GOALS
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    // ✅ GET BY EMPLOYEE
    public List<Goal> getGoalsByEmployee(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    // ✅ GET BY CYCLE
    public List<Goal> getGoalsByCycle(Long cycleId) {
        return goalRepository.findByCycleId(cycleId);
    }

    // ✅ GET BY USER ID (Maps user -> email -> employee -> goals)
    public List<Goal> getGoalsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Employee employee = employeeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Employee record not found for user: " + user.getEmail()));
        
        return goalRepository.findByEmployeeId(employee.getId());
    }

    // ✅ GET GOALS BY MANAGER NAME (only goals for employees assigned to this manager)
    public List<Goal> getGoalsByManagerName(String managerName) {
        List<Employee> teamEmployees = employeeRepository.findByManager(managerName);
        List<Long> employeeIds = teamEmployees.stream()
                .map(Employee::getId)
                .collect(Collectors.toList());

        if (employeeIds.isEmpty()) return List.of();

        return goalRepository.findAll().stream()
                .filter(g -> g.getEmployee() != null && employeeIds.contains(g.getEmployee().getId()))
                .collect(Collectors.toList());
    }

    // ✅ FULL UPDATE (Employee edits remarks/status)
    public Goal updateGoalFromEmployee(Long goalId, Goal updatedGoal) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setEmployeeRemarks(updatedGoal.getEmployeeRemarks());

        if ("COMPLETED".equalsIgnoreCase(updatedGoal.getStatus())) {
            goal.setStatus("COMPLETED");
        } else if ("SUBMITTED".equalsIgnoreCase(updatedGoal.getStatus())) {
            goal.setStatus("SUBMITTED");
        } else {
            goal.setStatus("IN_PROGRESS");
        }

        return goalRepository.save(goal);
    }

    // ✅ EMPLOYEE SUBMITS TARGET (sets status to SUBMITTED + notifies manager)
    public Goal submitGoal(Long goalId, Goal updatedGoal) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Save employee remarks
        if (updatedGoal.getEmployeeRemarks() != null) {
            goal.setEmployeeRemarks(updatedGoal.getEmployeeRemarks());
        }

        // Set status to SUBMITTED
        goal.setStatus("SUBMITTED");

        Goal savedGoal = goalRepository.save(goal);

        // Notify the manager that the employee has submitted their target
        Employee employee = goal.getEmployee();
        if (employee != null && employee.getManager() != null) {
            // Find the manager's user account by looking up the manager name
            // The manager's email is in the managers table
            Optional<com.example.appraisal_system.entity.Manager> mgr =
                    findManagerByName(employee.getManager());
            if (mgr.isPresent()) {
                Optional<User> mgrUser = userRepository.findByEmail(mgr.get().getEmail());
                if (mgrUser.isPresent()) {
                    notificationService.createNotification(
                        mgrUser.get().getId(),
                        "MANAGER",
                        "✅ " + employee.getName() + " submitted target: " + goal.getDescription(),
                        "TARGET_SUBMITTED"
                    );
                }
            }
        }

        return savedGoal;
    }

    @Autowired
    private ManagerRepository managerRepository;

    private Optional<com.example.appraisal_system.entity.Manager> findManagerByName(String managerName) {
        return managerRepository.findAll().stream()
                .filter(m -> m.getName().equalsIgnoreCase(managerName))
                .findFirst();
    }

    // ✅ UPDATE ONLY STATUS (Manager shortcut)
    public Goal updateStatus(Long goalId, String status) {

        Goal goal = goalRepository.findById(goalId).orElseThrow();

        goal.setStatus(status.toUpperCase());

        return goalRepository.save(goal);
    }

    // ✅ DELETE
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}