package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.SelfEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface SelfEvaluationRepository extends JpaRepository<SelfEvaluation, Long> {

    List<SelfEvaluation> findByCycleId(Long cycleId);

    Optional<SelfEvaluation> findByEmployeeId(Long employeeId);

    Optional<SelfEvaluation> findByEmployeeIdAndCycleId(Long employeeId, Long cycleId);

    @Modifying
    @Transactional
    void deleteByEmployee(Employee employee);
}