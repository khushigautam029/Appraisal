package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.SelfEvaluation;
import com.example.appraisal_system.service.SelfEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/evaluations")
public class SelfEvaluationController {

    @Autowired
    private SelfEvaluationService service;

    // SAVE DRAFT
    @PostMapping("/employee/{empId}/cycle/{cycleId}")
    public SelfEvaluation saveDraft(@PathVariable Long empId,
                                    @PathVariable Long cycleId,
                                    @RequestBody SelfEvaluation evaluation) {
        return service.saveDraft(empId, cycleId, evaluation);
    }

    // SUBMIT
    @PutMapping("/submit/{id}")
    public String submit(@PathVariable Long id) {
        service.submitEvaluation(id);
        return "Submitted";
    }

    // GET BY EMPLOYEE
    @GetMapping("/employee/{empId}")
    public Optional<SelfEvaluation> getByEmployee(@PathVariable Long empId) {
        return service.getByEmployee(empId);
    }

    // GET BY CYCLE
    @GetMapping("/cycle/{cycleId}")
    public List<SelfEvaluation> getByCycle(@PathVariable Long cycleId) {

        return service.getByCycle(cycleId);
    }

    // GET BY EMPLOYEE AND CYCLE
    @GetMapping("/employee/{empId}/cycle/{cycleId}")
    public Optional<SelfEvaluation> getByEmployeeAndCycle(@PathVariable Long empId, @PathVariable Long cycleId) {
        return service.getByEmployeeAndCycle(empId, cycleId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteEvaluation(id);
        return "Evaluation deleted successfully!";
    }
}