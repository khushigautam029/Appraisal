package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByEmail(String email);
    List<Manager> findAllByEmail(String email);
    Optional<Manager> findByName(String name);
}