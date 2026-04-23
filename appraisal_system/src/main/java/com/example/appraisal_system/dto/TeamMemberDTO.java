package com.example.appraisal_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamMemberDTO {
    private Long id;
    private String name;
    private String email;
    private String designation;
    private String department;
    private String status; // PENDING, SUBMITTED, COMPLETED
}
