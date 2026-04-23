package com.example.appraisal_system.config;

import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.repository.*;

import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer implements CommandLineRunner {

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
    if (userRepository.count() > 0) {
      System.out.println("✅ Data already seeded, skipping.");
      return;
    }
    seedUsers();
    seedCoreData();
    seedEmployeesAndGoals();
    seedReviewsAndEvaluations();
    seedNotifications();
    System.out.println("✅ Realistic company data seeded successfully.");
  }

  // ---------------- USERS ----------------
  private void seedUsers() {
    List<User> users = Arrays.asList(
        createUser("hr@psi.local", "hr123", "HR"),
        createUser("manager@psi.local", "manager123", "MANAGER"),
        createUser("employee@psi.local", "emp123", "EMPLOYEE"),
        createUser("bob.hr@psi.local", "bobhr123", "HR"),
        createUser("carol.sales@psi.local", "carolsales123", "MANAGER"),
        createUser("alice.manager@psi.local", "alicemanager123", "MANAGER"),
        createUser("jane.smith@psi.local", "jane123", "EMPLOYEE"),
        createUser("emily.hr@psi.local", "emilyhr123", "EMPLOYEE"),
        createUser("frank.sales@psi.local", "frank123", "EMPLOYEE"),
        createUser("john.doe@psi.local", "john123", "EMPLOYEE"));

    userRepository.saveAll(users);
  }

  private User createUser(String email, String password, String role) {
    User u = new User();
    u.setEmail(email);
    u.setPassword(password);
    u.setRole(role);
    return u;
  }

  // ---------------- CORE DATA ----------------
  private Department eng;
  private Department hrDept;
  private Department sales;

  private Manager engManager;
  private Manager hrManager;
  private Manager salesManager;

  private AppraisalCycle cycle2026;
  private AppraisalCycle cycle2025;

  private void seedCoreData() {

    eng = departmentRepository.save(new Department(null, "Engineering"));
    hrDept = departmentRepository.save(new Department(null, "HR"));
    sales = departmentRepository.save(new Department(null, "Sales"));

    engManager = managerRepository.save(
        new Manager(null, "Alice Manager", "alice.manager@psi.local", "Engineering", "Engineering Manager"));
    hrManager = managerRepository.save(
        new Manager(null, "Bob HR", "bob.hr@psi.local", "HR", "HR Manager"));
    salesManager = managerRepository.save(
        new Manager(null, "Carol Sales", "carol.sales@psi.local", "Sales", "Sales Manager"));

    cycle2026 = new AppraisalCycle();
    cycle2026.setName("2026 Annual Appraisal");
    cycle2026.setStartDate(LocalDate.of(2026, 1, 1));
    cycle2026.setEndDate(LocalDate.of(2026, 12, 31));
    cycle2026.setStatus("Active");
    appraisalCycleRepository.save(cycle2026);

    cycle2025 = new AppraisalCycle();
    cycle2025.setName("2025 Annual Appraisal");
    cycle2025.setStartDate(LocalDate.of(2025, 1, 1));
    cycle2025.setEndDate(LocalDate.of(2025, 12, 31));
    cycle2025.setStatus("Completed");
    appraisalCycleRepository.save(cycle2025);
  }

  // ---------------- EMPLOYEES + GOALS ----------------
  private List<Employee> employees = new ArrayList<>();

  private void seedEmployeesAndGoals() {

    employees = employeeRepository.saveAll(Arrays.asList(
        createEmployee("John Doe", "john.doe@psi.local", "Engineering", "Software Engineer", "Alice Manager"),
        createEmployee("Jane Smith", "jane.smith@psi.local", "Engineering", "QA Engineer", "Alice Manager"),
        createEmployee("Emily HR", "emily.hr@psi.local", "HR", "HR Executive", "Bob HR"),
        createEmployee("Frank Sales", "frank.sales@psi.local", "Sales", "Sales Executive", "Carol Sales"),
        createEmployee("Priya Patel", "priya.patel@psi.local", "Engineering", "DevOps Engineer", "Alice Manager"),
        createEmployee("Ravi Kumar", "ravi.kumar@psi.local", "Engineering", "Backend Developer", "Alice Manager"),
        createEmployee("Sara Lee", "sara.lee@psi.local", "HR", "HR Coordinator", "Bob HR"),
        createEmployee("Tom Brown", "tom.brown@psi.local", "Sales", "Sales Associate", "Carol Sales")));

    String[] titles = {
        "Complete Project X", "Improve Test Coverage", "Automate Deployments",
        "Increase Sales by 20%", "Employee Onboarding"
    };
    String[] descs = {
        "Deliver modules by Q3", "Reach 90% coverage",
        "Setup CI/CD", "Boost sales growth", "Onboard new hires"
    };

    int i = 0;
    for (Employee e : employees) {
      Goal g = new Goal();
      g.setTitle(titles[i % titles.length]);
      g.setDescription(descs[i % descs.length]);
      g.setTargetDate("2026-09-30");
      g.setStatus("IN_PROGRESS");
      g.setEmployee(e);
      g.setCycle(cycle2026);
      goalRepository.save(g);
      i++;
    }
  }

  private Employee createEmployee(String name, String email, String dept, String role, String manager) {
    return new Employee(null, name, email, dept, role, manager, "ACTIVE");
  }

  // ---------------- REVIEWS ----------------
  private void seedReviewsAndEvaluations() {
    Random rand = new Random();

    for (Employee e : employees) {
      SelfEvaluation se = new SelfEvaluation();
      se.setAchievements("Achievements for " + e.getName());
      se.setImprovements("Areas to improve for " + e.getName());
      se.setOrganizationWork("Team contribution");
      se.setSkills("Java, Spring Boot");
      se.setStatus("SUBMITTED");
      se.setEmployee(e);
      se.setCycle(cycle2025);
      selfEvaluationRepository.save(se);

      Review r = new Review();
      r.setRating(rand.nextInt(3) + 3);
      r.setRemarks("Good performance");
      r.setStrengths("Strong technical skills");
      r.setImprovements("Needs optimization focus");
      r.setCommunication("Excellent");
      r.setTechnicalSkills("Very Good");
      r.setTeamwork("Good");
      r.setPunctuality("On Time");
      r.setManagerStatus("COMPLETED");
      r.setHrRating(rand.nextInt(2) + 4);
      r.setHrRemarks("Consistent performer");
      r.setEmployee(e);
      r.setCycle(cycle2025);
      reviewRepository.save(r);
    }
  }

  // ---------------- NOTIFICATIONS ----------------
  private void seedNotifications() {
    for (Employee e : employees) {
      Notification n = new Notification();
      n.setUserId(e.getId());
      n.setRole("EMPLOYEE");
      n.setMessage("Welcome to the company, " + e.getName() + "!");
      n.setType("INFO");
      n.setRead(false);
      n.setCreatedAt(LocalDate.now().atStartOfDay());
      notificationRepository.save(n);
    }
  }
}