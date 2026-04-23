package com.example.appraisal_system.service;

import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
public class SelfEvaluationService {

    @Autowired
    private SelfEvaluationRepository repository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AppraisalCycleRepository cycleRepository;

    @Autowired
    private ManagerRepository managerRepository;

    // SAVE (DRAFT)
    public SelfEvaluation saveDraft(Long empId, Long cycleId, SelfEvaluation evaluation) {

        Employee employee = employeeRepository.findById(empId).orElseThrow();
        AppraisalCycle cycle = cycleRepository.findById(cycleId).orElseThrow();

        evaluation.setEmployee(employee);
        evaluation.setCycle(cycle);
        evaluation.setStatus("DRAFT");

        return repository.save(evaluation);
    }

    // SUBMIT
    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    public void submitEvaluation(Long id) {

        SelfEvaluation evaluation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // ✅ Update status
        evaluation.setStatus("SUBMITTED");

        repository.save(evaluation);

        // ✅ GET employee + manager
        Employee emp = evaluation.getEmployee();
        
        // 🔹 Propagate the Submitted state globally back to the Employee model
        emp.setStatus("SUBMITTED");
        employeeRepository.save(emp);

        String employeeName = emp.getName();
        String managerName = emp.getManager();
        String managerEmail = "khushigautam029@gmail.com"; // Default fallback
        Long managerId = 1L; // Default fallback

        if (managerName != null && !managerName.isEmpty()) {
            Optional<Manager> managerOpt = managerRepository.findByName(managerName);
            if (managerOpt.isPresent()) {
                managerEmail = managerOpt.get().getEmail();
                managerId = managerOpt.get().getId();
            }
        }

        // ✅ SEND EMAIL
        emailService.sendAppraisalMail(managerEmail, employeeName);
        
        // 🔔 Notification for Employee
        notificationService.createNotification(emp.getId(), "EMPLOYEE", "Self-appraisal submitted successfully.", "SUCCESS");
        
        // 🔔 Notification for Manager
        notificationService.createNotification(managerId, "MANAGER", "Employee " + employeeName + " submitted self-appraisal.", "INFO");
    }

    // GET BY EMPLOYEE
    public Optional<SelfEvaluation> getByEmployee(Long empId) {
        return repository.findByEmployeeId(empId);
    }

    // GET BY CYCLE
    public List<SelfEvaluation> getByCycle(Long cycleId) {
        return repository.findByCycleId(cycleId);
    }

    // GET BY EMPLOYEE AND CYCLE
    public Optional<SelfEvaluation> getByEmployeeAndCycle(Long empId, Long cycleId) {
        return repository.findByEmployeeIdAndCycleId(empId, cycleId);
    }

    // DELETE
    public void deleteEvaluation(Long id) {
        repository.deleteById(id);
    }
}