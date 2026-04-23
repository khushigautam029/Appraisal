package com.example.appraisal_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // The ID of the recipient (Employee, Manager, etc.)
    private String role; // "EMPLOYEE", "MANAGER"

    private String message;
    private String type; // e.g., "INFO", "WARNING", "SUCCESS"

    private boolean isRead;

    private LocalDateTime createdAt;
    
    // Default constructor to set timestamp
    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
}
