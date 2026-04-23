package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findAllByEmail(String email);
    
    @Query("SELECT e FROM Employee e WHERE LOWER(e.manager) = LOWER(:manager)")
    List<Employee> findByManager(@Param("manager") String manager);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Employee e SET e.manager = null WHERE e.manager = :managerName")
    void nullifyManager(@Param("managerName") String managerName);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Employee e SET e.manager = :newName WHERE e.manager = :oldName")
    void updateManagerName(@Param("oldName") String oldName, @Param("newName") String newName);
}