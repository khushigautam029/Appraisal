package com.example.appraisal_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "self_evaluations")
public class SelfEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Column(columnDefinition = "TEXT")
    private String organizationWork;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private String status; // DRAFT / SUBMITTED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"goals", "reviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AppraisalCycle cycle;

    // Constructors
    public SelfEvaluation() {}

    // Getters & Setters
    public Long getId() { return id; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }

    public String getImprovements() { return improvements; }
    public void setImprovements(String improvements) { this.improvements = improvements; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getOrganizationWork() { return organizationWork; }
    public void setOrganizationWork(String organizationWork) { this.organizationWork = organizationWork; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public AppraisalCycle getCycle() { return cycle; }
    public void setCycle(AppraisalCycle cycle) { this.cycle = cycle; }
}