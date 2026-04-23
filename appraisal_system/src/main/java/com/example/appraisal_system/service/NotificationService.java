package com.example.appraisal_system.service;

import com.example.appraisal_system.entity.Notification;
import com.example.appraisal_system.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public void createNotification(Long userId, String role, String message, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setRole(role);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false); // IMPORTANT
        repository.save(notification);
    }

    public List<Notification> getNotifications(Long userId, String role) {
        return repository.getUserNotifications(userId, role);
    }

    public List<Notification> getUnreadNotifications(Long userId, String role) {
        return repository.getUnreadNotifications(userId, role);
    }

    public Notification markAsRead(Long id) {
        Optional<Notification> opt = repository.findById(id);
        if (opt.isPresent()) {
            Notification notification = opt.get();
            notification.setRead(true);
            return repository.save(notification);
        }
        return null;
    }
}