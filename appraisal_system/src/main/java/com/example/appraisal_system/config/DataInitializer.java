package com.example.appraisal_system.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.appraisal_system.entity.AppraisalCycle;
import com.example.appraisal_system.entity.Department;
import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Goal;
import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.entity.Notification;
import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.entity.SelfEvaluation;
import com.example.appraisal_system.entity.User;
import com.example.appraisal_system.repository.AppraisalCycleRepository;
import com.example.appraisal_system.repository.DepartmentRepository;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.GoalRepository;
import com.example.appraisal_system.repository.ManagerRepository;
import com.example.appraisal_system.repository.NotificationRepository;
import com.example.appraisal_system.repository.ReviewRepository;
import com.example.appraisal_system.repository.SelfEvaluationRepository;
import com.example.appraisal_system.repository.UserRepository;

import lombok.Data;
/**
 * DatabaseSeeder - Initializes database with properly BCrypt hashed/salted passwords
 * 
 * ✅ Password Security Features:
 *    - BCryptPasswordEncoder with strength=10 (default)
 *    - Each password is individually salted
 *    - One-way hashing - original passwords cannot be recovered
 *    - Resistant to brute-force attacks via work factor
 * 
 * ⚠️  IMPORTANT: Delete the database before running with fresh data to avoid duplicates
 */
@Configuration
@Data
public class DataInitializer implements CommandLineRunner {

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private DepartmentRepository departmentRepository;
  @Autowired
  private ManagerRepository managerRepository;
  @Autowired
  private EmployeeRepository employeeRepository;
  @Autowired
  private AppraisalCycleRepository appraisalCycleRepository;
  @Autowired
  private GoalRepository goalRepository;
  @Autowired
  private ReviewRepository reviewRepository;
  @Autowired
  private SelfEvaluationRepository selfEvaluationRepository;
  @Autowired
  private NotificationRepository notificationRepository;

  @Override
  public void run(String... args) {
    // Skip seeding if data already exists (prevents duplicates)
    if (userRepository.count() > 0) {
      System.out.println("✅ Data already seeded, skipping initialization.");
      return;
    }

    try {
      System.out.println("🔄 Starting database initialization...");
      seedUsers();
      System.out.println("✅ Users seeded with BCrypt hashed passwords");
      
      seedCoreData();
      System.out.println("✅ Departments and managers seeded");
      
      seedEmployeesAndGoals();
      System.out.println("✅ Employees and goals seeded");
      
      seedReviewsAndEvaluations();
      System.out.println("✅ Reviews and evaluations seeded");
      
      seedNotifications();
      System.out.println("✅ Notifications seeded");
      
      System.out.println("\n✅ DATABASE INITIALIZATION COMPLETE");
      System.out.println("📋 Test Credentials Available (see seeder_credentials.md)");
    } catch (Exception e) {
      System.err.println("❌ Error during seeding: " + e.getMessage());
      e.printStackTrace();
    }
  }

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Seeds test users with BCrypt hashed passwords
   * Each password is salted and hashed using BCryptPasswordEncoder
   */
  private void seedUsers() {
    List<User> users = Arrays.asList(
        // HR Users (min 6 chars as per @Size validation)
        createUser("hr@psi.local", "Hr@psi123", "HR"),
        createUser("bob.hr@psi.local", "BobHr@123", "HR"),
        
        // Managers (min 6 chars as per @Size validation)
        createUser("manager@psi.local", "Manager@123", "MANAGER"),
        createUser("carol.sales@psi.local", "Carol@Sales123", "MANAGER"),
        createUser("alice.manager@psi.local", "Alice@Manager123", "MANAGER"),
        
        // Employees (min 6 chars as per @Size validation)
        createUser("employee@psi.local", "Emp@psi123", "EMPLOYEE"),
        createUser("jane.smith@psi.local", "Jane@Smith123", "EMPLOYEE"),
        createUser("emily.hr@psi.local", "Emily@Hr123", "EMPLOYEE"),
        createUser("frank.sales@psi.local", "Frank@Sales123", "EMPLOYEE"),
        createUser("john.doe@psi.local", "John@Doe123", "EMPLOYEE")
    );

    userRepository.saveAll(users);
  }

  /**
   * Creates a User with BCrypt hashed password
   * 
   * @param email User email
   * @param plainPassword Plain text password (will be hashed)
   * @param role User role (HR, MANAGER, EMPLOYEE)
   * @return User with hashed password
   */
  private User createUser(String email, String plainPassword, String role) {
    User user = new User();
    user.setEmail(email);
    // 🔐 BCrypt encoding: Hashes with salt, prevents rainbow table attacks
    user.setPassword(passwordEncoder.encode(plainPassword));
    user.setRole(role);
    return user;
  }

  // ==================== CORE DATA ====================
  
  private Department eng;
  private Department hrDept;
  private Department sales;

  private Manager engManager;
  private Manager hrManager;
  private Manager salesManager;

  private AppraisalCycle cycle2026;
  private AppraisalCycle cycle2025;

  /**
   * Seeds core organizational data: departments, managers, and appraisal cycles
   */
  private void seedCoreData() {
    // Create departments
    eng = departmentRepository.save(new Department(null, "Engineering"));
    hrDept = departmentRepository.save(new Department(null, "HR"));
    sales = departmentRepository.save(new Department(null, "Sales"));

    // Create managers for each department
    engManager = managerRepository.save(
        new Manager(null, "Alice Manager", "alice.manager@psi.local", "Engineering", "Engineering Manager"));
    hrManager = managerRepository.save(
        new Manager(null, "Bob HR", "bob.hr@psi.local", "HR", "HR Manager"));
    salesManager = managerRepository.save(
        new Manager(null, "Carol Sales", "carol.sales@psi.local", "Sales", "Sales Manager"));

    // Create 2026 active cycle
    cycle2026 = new AppraisalCycle();
    cycle2026.setName("2026 Annual Appraisal");
    cycle2026.setStartDate(LocalDate.of(2026, 1, 1));
    cycle2026.setEndDate(LocalDate.of(2026, 12, 31));
    cycle2026.setStatus("Active");
    appraisalCycleRepository.save(cycle2026);

    // Create 2025 completed cycle
    cycle2025 = new AppraisalCycle();
    cycle2025.setName("2025 Annual Appraisal");
    cycle2025.setStartDate(LocalDate.of(2025, 1, 1));
    cycle2025.setEndDate(LocalDate.of(2025, 12, 31));
    cycle2025.setStatus("Completed");
    appraisalCycleRepository.save(cycle2025);
  }

  // ==================== EMPLOYEES & GOALS ====================
  
  private List<Employee> employees = new ArrayList<>();

  /**
   * Seeds employees and their performance goals for 2026 cycle
   */
  private void seedEmployeesAndGoals() {
    // Create employees across all departments
    employees = employeeRepository.saveAll(Arrays.asList(
        createEmployee("John Doe", "john.doe@psi.local", "Engineering", "Software Engineer", "Alice Manager"),
        createEmployee("Jane Smith", "jane.smith@psi.local", "Engineering", "QA Engineer", "Alice Manager"),
        createEmployee("Emily HR", "emily.hr@psi.local", "HR", "HR Executive", "Bob HR"),
        createEmployee("Frank Sales", "frank.sales@psi.local", "Sales", "Sales Executive", "Carol Sales"),
        createEmployee("Priya Patel", "priya.patel@psi.local", "Engineering", "DevOps Engineer", "Alice Manager"),
        createEmployee("Ravi Kumar", "ravi.kumar@psi.local", "Engineering", "Backend Developer", "Alice Manager"),
        createEmployee("Sara Lee", "sara.lee@psi.local", "HR", "HR Coordinator", "Bob HR"),
        createEmployee("Tom Brown", "tom.brown@psi.local", "Sales", "Sales Associate", "Carol Sales")
    ));

    // Create performance goals for each employee
    String[] goalTitles = {
        "Complete Project X", "Improve Test Coverage", "Automate Deployments",
        "Increase Sales by 20%", "Employee Onboarding"
    };
    String[] goalDescriptions = {
        "Deliver modules by Q3", "Reach 90% coverage",
        "Setup CI/CD", "Boost sales growth", "Onboard new hires"
    };

    int i = 0;
    for (Employee e : employees) {
      Goal goal = new Goal();
      goal.setTitle(goalTitles[i % goalTitles.length]);
      goal.setDescription(goalDescriptions[i % goalDescriptions.length]);
      goal.setTargetDate("2026-09-30");
      goal.setStatus("IN_PROGRESS");
      goal.setEmployee(e);
      goal.setCycle(cycle2026);
      goalRepository.save(goal);
      i++;
    }
  }

  /**
   * Helper method to create an employee
   */
  private Employee createEmployee(String name, String email, String department, String designation, String manager) {
    return new Employee(null, name, email, department, designation, manager, "ACTIVE");
  }

  // ==================== REVIEWS & EVALUATIONS ====================

  /**
   * Seeds self-evaluations and manager reviews for 2025 completed cycle
   */
  private void seedReviewsAndEvaluations() {
    Random rand = new Random();

    for (Employee employee : employees) {
      // Create self-evaluation
      SelfEvaluation selfEval = new SelfEvaluation();
      selfEval.setAchievements("Achievements for " + employee.getName());
      selfEval.setImprovements("Areas to improve for " + employee.getName());
      selfEval.setOrganizationWork("Team contribution");
      selfEval.setSkills("Java, Spring Boot");
      selfEval.setStatus("SUBMITTED");
      selfEval.setEmployee(employee);
      selfEval.setCycle(cycle2025);
      selfEvaluationRepository.save(selfEval);

      // Create manager review
      Review managerReview = new Review();
      managerReview.setRating(rand.nextInt(3) + 3); // Rating 3-5
      managerReview.setRemarks("Good performance");
      managerReview.setStrengths("Strong technical skills");
      managerReview.setImprovements("Needs optimization focus");
      managerReview.setCommunication("Excellent");
      managerReview.setTechnicalSkills("Very Good");
      managerReview.setTeamwork("Good");
      managerReview.setPunctuality("On Time");
      managerReview.setManagerStatus("COMPLETED");
      managerReview.setHrRating(rand.nextInt(2) + 4); // HR Rating 4-5
      managerReview.setHrRemarks("Consistent performer");
      managerReview.setEmployee(employee);
      managerReview.setCycle(cycle2025);
      reviewRepository.save(managerReview);
    }
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Seeds welcome notifications for all employees
   */
  private void seedNotifications() {
    for (Employee employee : employees) {
      Notification notification = new Notification();
      notification.setUserId(employee.getId());
      notification.setRole("EMPLOYEE");
      notification.setMessage("Welcome to the company, " + employee.getName() + "!");
      notification.setType("INFO");
      notification.setRead(false);
      notification.setCreatedAt(LocalDate.now().atStartOfDay());
      notificationRepository.save(notification);
    }
  }
}