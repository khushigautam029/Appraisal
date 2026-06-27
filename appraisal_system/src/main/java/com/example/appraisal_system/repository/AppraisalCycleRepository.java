package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.AppraisalCycle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppraisalCycleRepository extends JpaRepository<AppraisalCycle, Long> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
