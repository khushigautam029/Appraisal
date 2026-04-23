package com.example.appraisal_system.service;

import com.example.appraisal_system.dto.DashboardResponse;
import com.example.appraisal_system.entity.SelfEvaluation;
import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.entity.AppraisalCycle;
import com.example.appraisal_system.repository.AppraisalCycleRepository;
import com.example.appraisal_system.repository.GoalRepository;
import com.example.appraisal_system.repository.SelfEvaluationRepository;
import com.example.appraisal_system.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private SelfEvaluationRepository selfEvaluationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AppraisalCycleRepository cycleRepository;

    @Autowired
    private com.example.appraisal_system.repository.UserRepository userRepository;

    @Autowired
    private com.example.appraisal_system.repository.EmployeeRepository employeeRepository;

    public DashboardResponse getDashboardByUserId(Long userId, Long cycleId) {
        com.example.appraisal_system.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.example.appraisal_system.entity.Employee employee = employeeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Employee record not found"));

        return getDashboard(employee.getId(), cycleId);
    }

    public DashboardResponse getDashboard(Long employeeId, Long cycleId) {

        DashboardResponse response = new DashboardResponse();

        // Total Goals for this cycle
        int totalGoals = (int) goalRepository.findByEmployeeId(employeeId).stream()
                .filter(g -> g.getCycle() != null && g.getCycle().getId().equals(cycleId))
                .count();

        // Completed Goals for this cycle (Count both COMPLETED and SUBMITTED as finished from employee POV)
        int completedGoals = (int) goalRepository.findByEmployeeId(employeeId).stream()
                .filter(g -> g.getCycle() != null && g.getCycle().getId().equals(cycleId) && 
                        ("COMPLETED".equals(g.getStatus()) || "SUBMITTED".equals(g.getStatus())))
                .count();

        // Pending = total - completed
        int pending = totalGoals - completedGoals;

        response.setTotalGoals(totalGoals);
        response.setCompletedGoals(completedGoals);
        response.setPendingReviews(pending);

        // Self Appraisal Status for this cycle
        SelfEvaluation selfEval = selfEvaluationRepository.findByEmployeeIdAndCycleId(employeeId, cycleId).orElse(null);

        // Review Status for this cycle
        Review review = reviewRepository.findByEmployeeIdAndCycleId(employeeId, cycleId).orElse(null);

        // 🔹 1. Self Appraisal Status
        if (selfEval == null) {
            response.setSelfAppraisalStatus("Not Started");
        } else if ("SUBMITTED".equals(selfEval.getStatus())) {
            response.setSelfAppraisalStatus("Submitted");
        } else if ("COMPLETED".equals(selfEval.getStatus())) {
             response.setSelfAppraisalStatus("Completed");
        } else {
            response.setSelfAppraisalStatus("Draft");
        }

        // 🔹 2. Manager Review Status
        if (review != null) {
            response.setManagerReviewStatus("Completed");
        } else if (selfEval != null && "SUBMITTED".equals(selfEval.getStatus())) {
            response.setManagerReviewStatus("Pending");
        } else {
            response.setManagerReviewStatus("Waiting on Employee");
        }

        // 🔹 3. HR Approval Status
        if (review != null && review.getHrRating() != null) {
            response.setHrApprovalStatus("Approved");
            response.setAppraisalStatus("Completed");
        } else if (review != null) {
            response.setHrApprovalStatus("Pending Approval");
            response.setAppraisalStatus("In Progress");
        } else {
            response.setHrApprovalStatus("Not Started");
            response.setAppraisalStatus(selfEval != null ? "In Progress" : "Not Started");
        }
        
        response.setPromotionStatus("No"); 

        return response;
    }
}