package com.example.appraisal_system.dto;

import lombok.Data;
import java.util.List;

@Data
public class HrStaffRequest {
    private Long id; // Optional, for updates
    private String name;
    private String email;
    private String password;
    private String primaryRole; // HR, MANAGER, EMPLOYEE
    private String secondaryRole; // Optional
    private String designation;
    private String department;
    private String manager; // Manager name (used for lookup/display)
    private String status; // ACTIVE, INACTIVE
    private List<Long> employeeIds; // List of employees to assign to the manager
}
