package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Appraisal;
import com.example.appraisal_system.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {
    @Modifying
    @Query("DELETE FROM Appraisal a WHERE a.employee = :employee")
    void deleteByEmployee(@Param("employee") Employee employee);
}