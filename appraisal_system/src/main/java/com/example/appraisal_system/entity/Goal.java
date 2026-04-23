package com.example.appraisal_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private String targetDate;

    private String managerRemarks;

    private String status; // IN_PROGRESS / COMPLETED

    private String employeeRemarks;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"goals", "reviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AppraisalCycle cycle;

    public Goal() {}

    // Getters & Setters
    public Long getId() { return id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetDate() { return targetDate; }
    public void setTargetDate(String targetDate) { this.targetDate = targetDate; }

    public String getManagerRemarks() { return managerRemarks; }
    public void setManagerRemarks(String managerRemarks) { this.managerRemarks = managerRemarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public AppraisalCycle getCycle() { return cycle; }
    public void setCycle(AppraisalCycle cycle) { this.cycle = cycle; }

    public String getEmployeeRemarks() { return employeeRemarks; }
    public void setEmployeeRemarks(String employeeRemarks) { this.employeeRemarks = employeeRemarks; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}