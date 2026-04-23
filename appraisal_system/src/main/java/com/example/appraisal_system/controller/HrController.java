package com.example.appraisal_system.controller;

import com.example.appraisal_system.dto.HrStaffRequest;
import com.example.appraisal_system.entity.Department;
import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hr")
public class HrController {

    @Autowired
    private HrService hrService;


    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        return ResponseEntity.ok(hrService.getDashboardData());
    }

    @PostMapping("/staff")
    public ResponseEntity<String> addStaff(@RequestBody HrStaffRequest request) {
        String result = hrService.addStaff(request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<String> updateStaff(@PathVariable Long id, @RequestBody HrStaffRequest request) {
        try {
            String result = hrService.updateStaff(id, request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.err.println("Error updating staff: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {
        try {
            String result = hrService.deleteStaff(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(hrService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<String> addDepartment(@RequestBody Department department) {
        String result = hrService.addDepartment(department);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
        String result = hrService.deleteDepartment(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(hrService.getAllReviews());
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<Review> updateHrReviewStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
            
        Integer hrRating = payload.containsKey("hrRating") ? Integer.parseInt(payload.get("hrRating").toString()) : null;
        String hrRemarks = payload.containsKey("hrRemarks") ? payload.get("hrRemarks").toString() : null;
        
        Review updatedReview = hrService.submitHrReviewStatus(id, hrRating, hrRemarks);
        return ResponseEntity.ok(updatedReview);
    }

    @PostMapping("/reset-staff")
    public ResponseEntity<String> resetStaff() {
        return ResponseEntity.ok(hrService.resetStaff());
    }
}
