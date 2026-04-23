package com.example.appraisal_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerReportDTO {
    private Long id;
    private String name;
    private String designation;
    private String department;
    private String status;
    private Integer rating;
    private String remarks;
}
