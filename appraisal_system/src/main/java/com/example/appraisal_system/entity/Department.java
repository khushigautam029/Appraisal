package com.example.appraisal_system.entity;

import jakarta.persistence.*;
import jdk.jfr.Description;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

//    private String description;

    // Constructors
    public Department() {}

    public Department(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters & Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

//    public String getDescription() { return Description; }
//
//    public void setDescription(String Description) { this.Description = Description; }
}