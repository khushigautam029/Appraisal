package com.example.appraisal_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    private String remarks;

    private String strengths;

    private String improvements;

    private String communication;
    private String technicalSkills;
    private String teamwork;
    private String punctuality;
    private String managerStatus;

    private Integer hrRating;
    private String hrRemarks;

    // Link to employee — exclude circular fields
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"goals", "reviews", "hibernateLazyInitializer", "handler"})
    private Employee employee;

    // Link to cycle — only expose id and name to avoid broken serialization
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cycle_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AppraisalCycle cycle;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getImprovements() { return improvements; }
    public void setImprovements(String improvements) { this.improvements = improvements; }

    public String getCommunication() { return communication; }
    public void setCommunication(String communication) { this.communication = communication; }

    public String getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(String technicalSkills) { this.technicalSkills = technicalSkills; }

    public String getTeamwork() { return teamwork; }
    public void setTeamwork(String teamwork) { this.teamwork = teamwork; }

    public String getPunctuality() { return punctuality; }
    public void setPunctuality(String punctuality) { this.punctuality = punctuality; }

    public String getManagerStatus() { return managerStatus; }
    public void setManagerStatus(String managerStatus) { this.managerStatus = managerStatus; }

    public Integer getHrRating() { return hrRating; }
    public void setHrRating(Integer hrRating) { this.hrRating = hrRating; }

    public String getHrRemarks() { return hrRemarks; }
    public void setHrRemarks(String hrRemarks) { this.hrRemarks = hrRemarks; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public AppraisalCycle getCycle() { return cycle; }
    public void setCycle(AppraisalCycle cycle) { this.cycle = cycle; }
}