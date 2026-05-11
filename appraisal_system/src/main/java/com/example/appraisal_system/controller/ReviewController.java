package com.example.appraisal_system.controller;

import java.util.List;

import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 🔹 Submit Review (ONLY ONCE PER CYCLE)
    @PostMapping("/{employeeId}/cycle/{cycleId}")
    @PreAuthorize("hasRole('MANAGER')")
    public String submitReview(@PathVariable Long employeeId,
                               @PathVariable Long cycleId,
                               @RequestBody Review review) {
        return reviewService.saveReview(employeeId, cycleId, review);
    }

    // 🔹 Get All Reviews
    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'MANAGER')")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // 🔹 Get Review by Employee ID
    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'EMPLOYEE')")
    public Review getReviewByEmployeeId(@PathVariable Long employeeId) {
        return reviewService.getReviewByEmployeeId(employeeId);
    }

    // 🔹 Get Review by Employee ID and Cycle ID
    @GetMapping("/{employeeId}/cycle/{cycleId}")
    @PreAuthorize("hasAnyRole('HR', 'MANAGER', 'EMPLOYEE')")
    public Review getReviewByEmployeeAndCycle(@PathVariable Long employeeId,
                                              @PathVariable Long cycleId) {
        return reviewService.getReviewByEmployeeAndCycle(employeeId, cycleId);
    }
}