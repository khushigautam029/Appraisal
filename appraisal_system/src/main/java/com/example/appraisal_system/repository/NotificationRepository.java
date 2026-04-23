package com.example.appraisal_system.repository;

import com.example.appraisal_system.entity.Notification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n " +
            "WHERE n.userId = :userId " +
            "OR n.role = 'ALL' " +
            "OR n.role = :role " +
            "ORDER BY n.createdAt DESC")
    List<Notification> getUserNotifications(@Param("userId") Long userId,
                                            @Param("role") String role);

    @Query("SELECT n FROM Notification n " +
            "WHERE (n.userId = :userId OR n.role = 'ALL' OR n.role = :role) " +
            "AND n.isRead = false " +
            "ORDER BY n.createdAt DESC")
    List<Notification> getUnreadNotifications(@Param("userId") Long userId,
                                              @Param("role") String role);

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}