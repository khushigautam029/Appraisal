package com.example.appraisal_system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.appraisal_system.dto.LoginRequest;
import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.entity.User;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.ManagerRepository;
import com.example.appraisal_system.security.JwtUtil;
import com.example.appraisal_system.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}) // Local development
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Login endpoint - Only requires email and password
     * Role is automatically fetched from database
     * 
     * @param loginRequest Email and password (role not required)
     * @return Token, user info, and role
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user with email and password
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

            // Fetch user name based on role from database
            String name = "User";
            if (user.getRole().contains("HR")) {
                name = "HR Admin";
            } else if (user.getRole().contains("MANAGER")) {
                name = managerRepository.findByEmail(user.getEmail())
                        .map(Manager::getName).orElse("Manager");
            } else if (user.getRole().contains("EMPLOYEE")) {
                name = employeeRepository.findByEmail(user.getEmail())
                        .map(Employee::getName).orElse("Employee");
            }

            // Build success response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("name", name);
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Log error for debugging
            System.err.println("❌ Login error: " + e.getMessage());
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Health check endpoint for local development
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Authentication service is running");
        return ResponseEntity.ok(response);
    }
}