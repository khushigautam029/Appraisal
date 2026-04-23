package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.Notification;
import com.example.appraisal_system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(
            @PathVariable Long userId,
            @RequestParam String role) {
        System.out.println("Fetching notifications for user: " + userId + " with role: " + role);
        return service.getNotifications(userId, role); // ✅ FIXED
    }

    @GetMapping("/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Long userId,
            @RequestParam String role) {

        return service.getUnreadNotifications(userId, role);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return service.markAsRead(id);
    }

    @PostMapping("/{userId}")
    public void createNotification(
            @PathVariable Long userId,
            @RequestParam String role,
            @RequestParam String message,
            @RequestParam String type) {

        service.createNotification(userId, role, message, type);
    }
}