package com.example.appraisal_system.service;

import java.util.List;

import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.entity.AppraisalCycle;
import com.example.appraisal_system.repository.AppraisalCycleRepository;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AppraisalCycleRepository cycleRepository;

    public String saveReview(Long employeeId, Long cycleId, Review review) {

        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        AppraisalCycle cycle = cycleRepository.findById(cycleId).orElse(null);

        if (emp == null || cycle == null) {
            return "Employee or Cycle not found!";
        }

        // 🔴 STRICT CHECK PER CYCLE
        if (reviewRepository.findByEmployeeIdAndCycleId(employeeId, cycleId).isPresent()) {
            throw new RuntimeException("❌ Review already submitted for this cycle!");
        }

        review.setEmployee(emp);
        review.setCycle(cycle);
        reviewRepository.save(review);

        // 🔹 Update Employee Status to COMPLETED for this cycle
        emp.setStatus("COMPLETED");
        employeeRepository.save(emp);

        // 🔔 Notification: Manager reviewed your appraisal
        notificationService.createNotification(employeeId, "EMPLOYEE", "Manager reviewed your appraisal ✅", "SUCCESS");

        return "✅ Review submitted successfully!";
    }
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewByEmployeeId(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId).orElse(null);
    }

    public Review getReviewByEmployeeAndCycle(Long employeeId, Long cycleId) {
        return reviewRepository.findByEmployeeIdAndCycleId(employeeId, cycleId).orElse(null);
    }
}