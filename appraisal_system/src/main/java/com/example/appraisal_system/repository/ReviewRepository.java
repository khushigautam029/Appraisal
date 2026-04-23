package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByEmployeeId(Long employeeId);
    
    Optional<Review> findByEmployeeIdAndCycleId(Long employeeId, Long cycleId);

    @Query("SELECT r FROM Review r JOIN FETCH r.employee JOIN FETCH r.cycle")
    List<Review> findAllWithDetails();

    @Modifying
    @Transactional
    void deleteByEmployee(Employee employee);
}