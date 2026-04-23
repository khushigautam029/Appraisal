package com.example.appraisal_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ METHOD MUST BE INSIDE CLASS
    public void sendAppraisalMail(String toEmail, String employeeName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("📢 Self Appraisal Submitted - Action Required");

            String htmlContent = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">

                <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

                  <!-- HEADER -->
                  <div style="background:#4A90E2; color:white; padding:15px; text-align:center;">
                    <h2>Appraisal Submitted</h2>
                  </div>

                  <!-- BODY -->
                  <div style="padding:20px; color:#333;">

                    <p>Dear Manager,</p>

                    <p>
                      The self appraisal form has been successfully submitted by the employee.
                      Please review the details below:
                    </p>

                    <!-- DETAILS BOX -->
                    <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:10px;">
                      
                      <p><b>👤 Employee Name:</b> %s</p>
                      <p><b>📅 Submission Date:</b> %s</p>
                      <p><b>📌 Status:</b> <span style="color:green;">Submitted</span></p>

                    </div>

                    <!-- MESSAGE -->
                    <p style="margin-top:15px;">
                      📝 The employee has completed and submitted their self-evaluation form.
                      Kindly review and proceed with the appraisal process.
                    </p>

                    <!-- BUTTON -->
                    <div style="text-align:center; margin-top:20px;">
                      <a href="http://localhost:5173"
                         style="background:#4A90E2; color:white; padding:12px 20px;
                                text-decoration:none; border-radius:5px; font-weight:bold;">
                        🔍 Review Appraisal
                      </a>
                    </div>

                  </div>

                  <!-- FOOTER -->
                  <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px; color:#777;">
                    This is an automated message from the Appraisal System.
                  </div>

                </div>

              </body>
            </html>
        """.formatted(employeeName, java.time.LocalDate.now());

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendWelcomeEmail(String toEmail, String name, String role, String password) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Welcome to the Appraisal System!");

            String htmlContent = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
                <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                  <div style="background:#4A90E2; color:white; padding:15px; text-align:center;">
                    <h2>Welcome, %s!</h2>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <p>We are excited to have you on board. Your account has been created successfully.</p>
                    <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:10px;">
                      <p><b>📧 Email:</b> %s</p>
                      <p><b>🔑 Initial Password:</b> %s</p>
                      <p><b>👤 Role:</b> %s</p>
                    </div>
                    <p style="margin-top:15px;">Please login and change your password as soon as possible.</p>
                    <div style="text-align:center; margin-top:20px;">
                      <a href="http://localhost:5173" style="background:#4A90E2; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">Login Now</a>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px; color:#777;">
                    This is an automated message from the Appraisal System.
                  </div>
                </div>
              </body>
            </html>
            """.formatted(name, toEmail, password, role);

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendAppraisalCycleMail(String toEmail, String cycleName, LocalDate startDate, LocalDate endDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("📢 New Appraisal Cycle Started: " + cycleName);

            String htmlContent = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
                <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                  <div style="background:#FF9800; color:white; padding:15px; text-align:center;">
                    <h2>New Appraisal Cycle</h2>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <p>A new appraisal cycle has been announced. Here are the details:</p>
                    <div style="background:#fff3e0; padding:15px; border-radius:8px; margin-top:10px;">
                      <p><b>📌 Cycle Name:</b> %s</p>
                      <p><b>📅 Start Date:</b> %s</p>
                      <p><b>📅 End Date:</b> %s</p>
                    </div>
                    <p style="margin-top:15px;">Please make sure to set your goals and prepare for the self-evaluation.</p>
                    <div style="text-align:center; margin-top:20px;">
                      <a href="http://localhost:5173" style="background:#FF9800; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">View Details</a>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px; color:#777;">
                    This is an automated message from the Appraisal System.
                  </div>
                </div>
              </body>
            </html>
            """.formatted(cycleName, startDate, endDate);

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}