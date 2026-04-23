package com.example.appraisal_system.controller;

import com.example.appraisal_system.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send")
    public String sendMail() {
        emailService.sendAppraisalMail(
                "khushigautam029@gmail.com",
                "Khushi"
        );

        return "Email Sent Successfully!";
    }
}