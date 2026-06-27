package com.example.appraisal_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.appraisal_system.entity.AppraisalCycle;
// import com.example.appraisal_system.entity.Employee;
// import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.repository.AppraisalCycleRepository;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.GoalRepository;
import com.example.appraisal_system.repository.ManagerRepository;
import com.example.appraisal_system.repository.ReviewRepository;
import com.example.appraisal_system.repository.SelfEvaluationRepository;

@Service
public class AppraisalCycleService {

    @Autowired
    private AppraisalCycleRepository repository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private SelfEvaluationRepository selfEvaluationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // Create
    public AppraisalCycle createCycle(AppraisalCycle cycle) {
        validateCycle(cycle);
        if (repository.existsByNameIgnoreCase(cycle.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only one appraisal cycle is allowed for " + cycle.getName());
        }

        // If the new cycle is active, deactivate all others
        if ("Active".equalsIgnoreCase(cycle.getStatus())) {
            deactivateAllCycles();
        }

        AppraisalCycle saved = repository.save(cycle);

        // Broadcast to everyone (userId 0L)
        notificationService.createNotification(0L, "ALL", "New Appraisal Cycle Started: " + cycle.getName(), "INFO");

        // ✅ SEND EMAILS TO ALL EMPLOYEES
        employeeRepository.findAll().forEach(emp -> {
            emailService.sendAppraisalCycleMail(emp.getEmail(), cycle.getName(), cycle.getStartDate(),
                    cycle.getEndDate());
        });

        // ✅ SEND EMAILS TO ALL MANAGERS
        managerRepository.findAll().forEach(mgr -> {
            emailService.sendAppraisalCycleMail(mgr.getEmail(), cycle.getName(), cycle.getStartDate(),
                    cycle.getEndDate());
        });

        return saved;
    }

    private void deactivateAllCycles() {
        List<AppraisalCycle> activeCycles = repository.findAll().stream()
                .filter(c -> "Active".equalsIgnoreCase(c.getStatus()))
                .toList();
        for (AppraisalCycle c : activeCycles) {
            c.setStatus("Inactive");
        }
        repository.saveAll(activeCycles);
    }

    // Get All
    public List<AppraisalCycle> getAllCycles() {
        return repository.findAll();
    }

    // Get By ID
    public AppraisalCycle getCycleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cycle not found"));
    }

    // Update
    public AppraisalCycle updateCycle(Long id, AppraisalCycle updatedCycle) {
        AppraisalCycle cycle = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cycle not found"));

        validateCycle(updatedCycle);
        if (repository.existsByNameIgnoreCaseAndIdNot(updatedCycle.getName(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only one appraisal cycle is allowed for " + updatedCycle.getName());
        }

        // If status is being changed to Active, deactivate others
        if ("Active".equalsIgnoreCase(updatedCycle.getStatus()) && !"Active".equalsIgnoreCase(cycle.getStatus())) {
            deactivateAllCycles();
        }

        cycle.setName(updatedCycle.getName());
        cycle.setStartDate(updatedCycle.getStartDate());
        cycle.setEndDate(updatedCycle.getEndDate());
        cycle.setStatus(updatedCycle.getStatus());

        return repository.save(cycle);
    }

    // Delete
    public void deleteCycle(Long id) {
        AppraisalCycle cycle = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cycle not found"));

        long goalCount = goalRepository.countByCycleId(id);
        long evaluationCount = selfEvaluationRepository.countByCycleId(id);
        long reviewCount = reviewRepository.countByCycleId(id);

        if (goalCount + evaluationCount + reviewCount > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot delete this cycle because goals, self evaluations, or reviews are linked to it.");
        }

        if ("Active".equalsIgnoreCase(cycle.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active cycle cannot be deleted.");
        }

        repository.deleteById(id);
    }

    private void validateCycle(AppraisalCycle cycle) {
        if (cycle.getName() == null || cycle.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Financial year is required.");
        }

        if (cycle.getStartDate() == null || cycle.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date and end date are required.");
        }

        if (!cycle.getStartDate().isBefore(cycle.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date must be before end date.");
        }
    }
}
