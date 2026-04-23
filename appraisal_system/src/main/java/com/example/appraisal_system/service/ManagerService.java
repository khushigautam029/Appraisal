package com.example.appraisal_system.service;

import com.example.appraisal_system.dto.ManagerReportDTO;
import com.example.appraisal_system.dto.TeamMemberDTO;
import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ManagerService {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private GoalRepository goalRepo;

    @Autowired
    private SelfEvaluationRepository selfEvalRepo;

    @Autowired
    private ReviewRepository reviewRepo;

    public List<ManagerReportDTO> getManagerReports(String managerName, Long cycleId) {
        List<Employee> myEmployees = employeeRepo.findByManager(managerName);
        List<ManagerReportDTO> reports = new ArrayList<>();

        for (Employee emp : myEmployees) {
            String status = "PENDING";
            Integer rating = 0;
            String remarks = "No feedback yet";

            // Check if Review exists
            Optional<Review> review = reviewRepo.findByEmployeeIdAndCycleId(emp.getId(), cycleId);
            if (review.isPresent()) {
                status = "COMPLETED";
                rating = review.get().getRating();
                remarks = review.get().getRemarks();
            } else {
                // Check if SelfEvaluation is submitted
                Optional<SelfEvaluation> selfEval = selfEvalRepo.findByEmployeeIdAndCycleId(emp.getId(), cycleId);
                if (selfEval.isPresent() && "SUBMITTED".equals(selfEval.get().getStatus())) {
                    status = "SUBMITTED";
                }
            }

            reports.add(new ManagerReportDTO(
                emp.getId(),
                emp.getName(),
                emp.getDesignation(),
                emp.getDepartment(),
                status,
                rating,
                remarks
            ));
        }

        return reports;
    }

    // 🔹 Team Status for a Cycle
    public List<TeamMemberDTO> getTeamStatus(String managerName, Long cycleId) {
        List<Employee> myEmployees = employeeRepo.findByManager(managerName);
        List<TeamMemberDTO> teamStatusList = new ArrayList<>();

        for (Employee emp : myEmployees) {
            String status = "PENDING";

            // Check if Review exists (COMPLETED)
            Optional<Review> review = reviewRepo.findByEmployeeIdAndCycleId(emp.getId(), cycleId);
            if (review.isPresent()) {
                status = "COMPLETED";
            } else {
                // Check if SelfEvaluation is submitted (SUBMITTED)
                Optional<SelfEvaluation> selfEval = selfEvalRepo.findByEmployeeIdAndCycleId(emp.getId(), cycleId);
                if (selfEval.isPresent() && "SUBMITTED".equals(selfEval.get().getStatus())) {
                    status = "SUBMITTED";
                }
            }

            teamStatusList.add(new TeamMemberDTO(
                emp.getId(),
                emp.getName(),
                emp.getEmail(),
                emp.getDesignation(),
                emp.getDepartment(),
                status
            ));
        }

        return teamStatusList;
    }

    // 🔹 Dashboard Stats (Uses logical status)
    public long getPendingReviewsCount(String managerName, Long cycleId) {
        return getTeamStatus(managerName, cycleId).stream()
                .filter(t -> "SUBMITTED".equals(t.getStatus()))
                .count();
    }

    public long getCompletedReviewsCount(String managerName, Long cycleId) {
        return getTeamStatus(managerName, cycleId).stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .count();
    }

    // 🔹 Legacy (Keep for internal use if needed, but marked for deprecation)
    public List<Employee> getMyEmployees(String managerName) {
        return employeeRepo.findByManager(managerName);
    }

    // 🔹 Assign Target
    public Goal assignGoal(Goal goal) {
        return goalRepo.save(goal);
    }

    // 🔹 Delete Target
    public void deleteGoal(Long id) {
        goalRepo.deleteById(id);
    }
}