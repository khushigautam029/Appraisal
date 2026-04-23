package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.User;
import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.appraisal_system.security.JwtUtil;
import com.example.appraisal_system.repository.ManagerRepository;
import com.example.appraisal_system.repository.EmployeeRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public java.util.Map<String, Object> login(@RequestBody User request) {

        User user = authService.login(request.getEmail(), request.getPassword());

        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        // ✅ FETCH NAME BASED ON ROLE
        String name = "User";
        if (user.getRole().contains("HR")) {
            name = "HR Admin"; // HR might not have a separate record or we can fetch if it exists
        } else if (user.getRole().contains("MANAGER")) {
            name = managerRepository.findByEmail(user.getEmail())
                    .map(m -> m.getName()).orElse("Manager");
        } else if (user.getRole().contains("EMPLOYEE")) {
            name = employeeRepository.findByEmail(user.getEmail())
                    .map(e -> e.getName()).orElse("Employee");
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("role", user.getRole());
        response.put("email", user.getEmail());
        response.put("name", name); // ✅ INCLUDE NAME

        return response;
    }
}