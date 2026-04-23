package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByEmployeeId(Long employeeId);

    List<Goal> findByCycleId(Long cycleId);

    long countByEmployeeId(Long employeeId);

    long countByEmployeeIdAndStatus(Long employeeId, String status);

    @Modifying
    @Transactional
    void deleteByEmployee(Employee employee);
}