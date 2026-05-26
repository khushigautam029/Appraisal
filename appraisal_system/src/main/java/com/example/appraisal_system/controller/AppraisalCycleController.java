package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.AppraisalCycle;
import com.example.appraisal_system.service.AppraisalCycleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cycles")
public class AppraisalCycleController {

    @Autowired
    private AppraisalCycleService service;

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public String createCycle(@RequestBody AppraisalCycle cycle) {
        service.createCycle(cycle);
        return "Cycle inserted successfully!";
    }

    // GET ALL
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<AppraisalCycle> getAllCycles() {
        return service.getAllCycles();
    }

    // GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public AppraisalCycle getCycle(@PathVariable Long id) {
        return service.getCycleById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public AppraisalCycle updateCycle(@PathVariable Long id, @RequestBody AppraisalCycle cycle) {
        return service.updateCycle(id, cycle);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public String deleteCycle(@PathVariable Long id) {
        service.deleteCycle(id);
        return "Cycle deleted successfully!";
    }
}
