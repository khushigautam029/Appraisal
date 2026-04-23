package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);
    java.util.List<User> findAllByEmail(String email);
}