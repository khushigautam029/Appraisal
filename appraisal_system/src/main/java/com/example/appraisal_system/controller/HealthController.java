package com.example.appraisal_system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Appraisal System Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("apiVersion", "1.0");
        config.put("baseUrl", getBaseUrl());
        return ResponseEntity.ok(config);
    }

    private String getBaseUrl() {
        return System.getenv("BACKEND_URL") != null 
            ? System.getenv("BACKEND_URL") 
            : "http://localhost:8080";
    }
}
