package com.example.appraisal_system.service;

import com.example.appraisal_system.entity.AppraisalCycle;
import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.repository.AppraisalCycleRepository;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    // Create
    public AppraisalCycle createCycle(AppraisalCycle cycle) {
        // If the new cycle is active, deactivate all others
        if ("Active".equals(cycle.getStatus())) {
            deactivateAllCycles();
        }

        AppraisalCycle saved = repository.save(cycle);

        // Broadcast to everyone (userId 0L)
        notificationService.createNotification(0L, "ALL", "New Appraisal Cycle Started: " + cycle.getName(), "INFO");

        // ✅ SEND EMAILS TO ALL EMPLOYEES
        employeeRepository.findAll().forEach(emp -> {
            emailService.sendAppraisalCycleMail(emp.getEmail(), cycle.getName(), cycle.getStartDate(), cycle.getEndDate());
        });

        // ✅ SEND EMAILS TO ALL MANAGERS
        managerRepository.findAll().forEach(mgr -> {
            emailService.sendAppraisalCycleMail(mgr.getEmail(), cycle.getName(), cycle.getStartDate(), cycle.getEndDate());
        });

        return saved;
    }

    private void deactivateAllCycles() {
        List<AppraisalCycle> activeCycles = repository.findAll().stream()
                .filter(c -> "Active".equals(c.getStatus()))
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
        return repository.findById(id).orElse(null);
    }

    // Update
    public AppraisalCycle updateCycle(Long id, AppraisalCycle updatedCycle) {
        AppraisalCycle cycle = repository.findById(id).orElseThrow();

        // If status is being changed to Active, deactivate others
        if ("Active".equals(updatedCycle.getStatus()) && !"Active".equals(cycle.getStatus())) {
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
        repository.deleteById(id);
    }
}