package com.example.appraisal_system.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.appraisal_system.dto.HrStaffRequest;
import com.example.appraisal_system.entity.Department;
import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.entity.Manager;
import com.example.appraisal_system.entity.Review;
import com.example.appraisal_system.entity.User;
import com.example.appraisal_system.repository.AppraisalRepository;
import com.example.appraisal_system.repository.DepartmentRepository;
import com.example.appraisal_system.repository.EmployeeRepository;
import com.example.appraisal_system.repository.GoalRepository;
import com.example.appraisal_system.repository.ManagerRepository;
import com.example.appraisal_system.repository.NotificationRepository;
import com.example.appraisal_system.repository.ReviewRepository;
import com.example.appraisal_system.repository.SelfEvaluationRepository;
import com.example.appraisal_system.repository.UserRepository;

@Service
public class HrService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private SelfEvaluationRepository selfEvaluationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AppraisalRepository appraisalRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();

        List<Employee> employees = employeeRepository.findAll();
        List<Manager> managers = managerRepository.findAll();
        List<Department> departments = departmentRepository.findAll();

        // 🛡️ SELF-HEALING: Repair missing user records automatically
        repairMissingUsers(employees, managers);

        data.put("totalEmployees", employees.size());
        data.put("totalManagers", managers.size());
        data.put("totalDepartments", departments.size());

        // ✅ Add reports to manager data
        List<Map<String, Object>> managersWithReports = managers.stream().map(m -> {
            Map<String, Object> mMap = new HashMap<>();
            mMap.put("id", m.getId());
            mMap.put("name", m.getName());
            mMap.put("email", m.getEmail());
            mMap.put("department", m.getDepartment());
            mMap.put("designation", m.getDesignation());
            mMap.put("status", "ACTIVE");

            // 🔥 FIND THIS MANAGER'S OWN SUPERVISOR
            Optional<Employee> myEmpRecord = employees.stream()
                    .filter(e -> e.getEmail().equals(m.getEmail()))
                    .findFirst();
            mMap.put("manager", myEmpRecord.isPresent() ? myEmpRecord.get().getManager() : "Not Assigned");

            List<String> reports = employees.stream()
                    .filter(e -> m.getName().equals(e.getManager()))
                    .map(e -> e.getName())
                    .toList();
            mMap.put("reports", reports);
            return mMap;
        }).toList();

        // ✅ Serialize employees
        List<Map<String, Object>> employeeMaps = employees.stream().map(e -> {
            Map<String, Object> eMap = new HashMap<>();
            eMap.put("id", e.getId());
            eMap.put("name", e.getName());
            eMap.put("email", e.getEmail());
            eMap.put("department", e.getDepartment());
            eMap.put("designation", e.getDesignation());
            eMap.put("manager", e.getManager());
            eMap.put("status", e.getStatus());
            return eMap;
        }).toList();

        data.put("employees", employeeMaps);
        data.put("managers", managersWithReports);
        data.put("departments", departments);

        return data;
    }

    @Transactional
    public String addStaff(HrStaffRequest request) {
        if (request.getPassword() == null || request.getPassword().trim().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String role = request.getPrimaryRole() != null ? request.getPrimaryRole().toUpperCase() : "EMPLOYEE";
        if (request.getSecondaryRole() != null && !request.getSecondaryRole().isEmpty()
                && !request.getSecondaryRole().equalsIgnoreCase("None")) {
            role += "," + request.getSecondaryRole().toUpperCase();
        }
        user.setRole(role);
        userRepository.save(user);

        String status = request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "ACTIVE";

        // Create Employee/Manager record
        if (role.contains("EMPLOYEE")) {
            Employee employee = new Employee();
            employee.setName(request.getName());
            employee.setEmail(request.getEmail());
            employee.setDepartment(request.getDepartment());
            employee.setDesignation(request.getDesignation());
            employee.setManager(request.getManager());
            employee.setStatus(status);
            employeeRepository.save(employee);
        }

        if (role.contains("MANAGER")) {
            Manager manager = new Manager();
            manager.setName(request.getName());
            manager.setEmail(request.getEmail());
            manager.setDepartment(request.getDepartment());
            manager.setDesignation(request.getDesignation());
            managerRepository.save(manager);

            // 🔥 Also create/ensure Employee record exists so they can have a manager
            if (!role.contains("EMPLOYEE")) {
                Employee employee = new Employee();
                employee.setName(request.getName());
                employee.setEmail(request.getEmail());
                employee.setDepartment(request.getDepartment());
                employee.setDesignation(request.getDesignation());
                employee.setManager(request.getManager()); // Assigned supervisor
                employee.setStatus(status);
                employeeRepository.save(employee);
            }

            handleEmployeeAssignments(request.getName(), request.getEmployeeIds());
        }

        emailService.sendWelcomeEmail(request.getEmail(), request.getName(), role, request.getPassword());
        return "Staff added successfully.";
    }

    @Transactional
    public String updateStaff(Long id, HrStaffRequest request) {
        System.out.println("=== updateStaff called === id=" + id + " email=" + request.getEmail() + " name="
                + request.getName() + " role=" + request.getPrimaryRole() + " manager=" + request.getManager());

        // Guard: email and name are mandatory
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required for staff update.");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required for staff update.");
        }

        String primaryRole = request.getPrimaryRole() != null ? request.getPrimaryRole().toUpperCase() : "EMPLOYEE";

        // 1. Determine old email from the CORRECT table based on primaryRole
        String oldEmail = null;
        String oldName = null;

        if (primaryRole.contains("MANAGER")) {
            Optional<Manager> mgrOpt = managerRepository.findById(id);
            if (mgrOpt.isPresent()) {
                oldEmail = mgrOpt.get().getEmail();
                oldName = mgrOpt.get().getName();
            }
        } else {
            Optional<Employee> empOpt = employeeRepository.findById(id);
            if (empOpt.isPresent()) {
                oldEmail = empOpt.get().getEmail();
                oldName = empOpt.get().getName();
            }
        }

        if (oldEmail == null) {
            oldEmail = request.getEmail();
        }

        // 2. Find and update the User record
        List<User> userList = userRepository.findAllByEmail(oldEmail);
        if (userList.isEmpty()) {
            userList = userRepository.findAllByEmail(request.getEmail());
        }

        User user;
        if (!userList.isEmpty()) {
            user = userList.get(0);
        } else {
            // Self-healing: Create missing user record
            System.out.println("Self-healing: Creating missing user record for " + request.getEmail());
            user = new User();
            String rawPass = request.getPassword() != null && !request.getPassword().isEmpty() ? request.getPassword()
                    : "Welcome@123";
            user.setPassword(passwordEncoder.encode(rawPass));
        }

        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (request.getPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        String role = primaryRole;
        if (request.getSecondaryRole() != null && !request.getSecondaryRole().isEmpty()
                && !request.getSecondaryRole().equalsIgnoreCase("None")) {
            role += "," + request.getSecondaryRole().toUpperCase();
        }
        user.setRole(role);
        userRepository.save(user);

        // 3. FLUSH and CLEAR the persistence context BEFORE touching Employee/Manager
        // tables
        // This prevents stale/corrupt entities from causing PropertyValueException
        entityManager.flush();
        entityManager.clear();

        // 4. Update ONLY the table relevant to the role
        if (role.contains("EMPLOYEE")) {
            updateEmployeeRecord(oldEmail, request, role);
        }
        if (role.contains("MANAGER")) {
            updateManagerRecord(oldEmail, request, role);
        }

        // 5. SYNC MANAGER NAME CHANGES ACROSS EMPLOYEES
        if (role.contains("MANAGER")) {
            if (oldName != null && !oldName.equals(request.getName())) {
                employeeRepository.updateManagerName(oldName, request.getName());
            }
            // For managers, we also need to update their OWN employee record if they report
            // to someone
            updateEmployeeRecord(oldEmail, request, "EMPLOYEE,MANAGER");

            handleEmployeeAssignments(request.getName(), request.getEmployeeIds());
        }

        return "Staff updated successfully.";
    }

    private void handleEmployeeAssignments(String managerName, List<Long> employeeIds) {
        if (employeeIds == null)
            return;

        // Clear persistence context before bulk operations to prevent stale cache
        entityManager.flush();
        entityManager.clear();

        // Unassign everyone currently reporting to THIS manager name (safety reset)
        employeeRepository.nullifyManager(managerName);

        // Assign requested ones (persistence context is clean now)
        for (Long empId : employeeIds) {
            employeeRepository.findById(empId).ifPresent(emp -> {
                emp.setManager(managerName);
                employeeRepository.save(emp);
            });
        }
    }

    @Transactional
    public String deleteStaff(Long id) {
        System.out.println("=== deleteStaff called === ID: " + id);

        String email = null;
        String managerName = null;
        boolean deletedSomething = false;

        // 1. Resolve Identity and Delete by ID immediately (Safe for Ghost Records)
        Optional<Employee> empById = employeeRepository.findById(id);
        if (empById.isPresent()) {
            Employee emp = empById.get();
            email = emp.getEmail();
            System.out.println("Targeting Employee ID: " + id + " Email: " + email);

            // Clean up dependents
            appraisalRepository.deleteByEmployee(emp);
            goalRepository.deleteByEmployee(emp);
            reviewRepository.deleteByEmployee(emp);
            selfEvaluationRepository.deleteByEmployee(emp);

            employeeRepository.delete(emp);
            deletedSomething = true;
        }

        Optional<Manager> mgrById = managerRepository.findById(id);
        if (mgrById.isPresent()) {
            Manager mgr = mgrById.get();
            if (email == null)
                email = mgr.getEmail();
            managerName = mgr.getName();
            System.out.println("Targeting Manager ID: " + id + " Email: " + email);

            if (managerName != null) {
                employeeRepository.nullifyManager(managerName);
            }

            managerRepository.delete(mgr);
            deletedSomething = true;
        }

        Optional<User> userById = userRepository.findById(id);
        if (userById.isPresent()) {
            User user = userById.get();
            if (email == null)
                email = user.getEmail();
            System.out.println("Targeting User ID: " + id + " Email: " + email);

            notificationRepository.deleteByUserId(user.getId());
            userRepository.delete(user);
            deletedSomething = true;
        }

        // 2. Cross-Table Cleanup by Email (Handle duplicates and linked accounts)
        if (email != null && !email.isBlank()) {
            final String targetEmail = email;
            System.out.println("Performing cross-table cleanup for email: " + targetEmail);

            List<Employee> employeeList = employeeRepository.findAllByEmail(targetEmail);
            for (Employee emp : employeeList) {
                appraisalRepository.deleteByEmployee(emp);
                goalRepository.deleteByEmployee(emp);
                reviewRepository.deleteByEmployee(emp);
                selfEvaluationRepository.deleteByEmployee(emp);
            }
            employeeRepository.deleteAll(employeeList);

            List<Manager> managerList = managerRepository.findAllByEmail(targetEmail);
            for (Manager m : managerList) {
                employeeRepository.nullifyManager(m.getName());
            }
            managerRepository.deleteAll(managerList);

            List<User> userList = userRepository.findAllByEmail(targetEmail);
            for (User u : userList) {
                notificationRepository.deleteByUserId(u.getId());
            }
            userRepository.deleteAll(userList);
            deletedSomething = true;
        }

        if (!deletedSomething) {
            System.err.println("CRITICAL: No staff records found for ID: " + id);
            throw new RuntimeException("No staff records found for ID: " + id);
        }

        entityManager.flush();
        return "Staff records for ID " + id + (email != null ? " (" + email + ")" : "") + " cleared.";
    }

    private void updateEmployeeRecord(String oldEmail, HrStaffRequest request, String role) {
        List<Employee> emps = employeeRepository.findAllByEmail(oldEmail);

        if (role.contains("EMPLOYEE")) {
            Employee employee = emps.isEmpty() ? new Employee() : emps.get(0);
            employee.setName(request.getName());
            employee.setEmail(request.getEmail());
            employee.setDepartment(request.getDepartment());
            employee.setDesignation(request.getDesignation());
            employee.setManager(request.getManager());
            String targetStatus = request.getStatus();
            if (targetStatus == null || targetStatus.isBlank()) {
                targetStatus = employee.getStatus() != null ? employee.getStatus() : "ACTIVE";
            }
            employee.setStatus(targetStatus);
            employeeRepository.save(employee);

            // Clean up other duplicates if they exist
            if (emps.size() > 1) {
                for (int i = 1; i < emps.size(); i++) {
                    employeeRepository.delete(emps.get(i));
                }
            }
        } else if (!emps.isEmpty()) {
            employeeRepository.deleteAll(emps);
        }
    }

    private void updateManagerRecord(String oldEmail, HrStaffRequest request, String role) {
        List<Manager> mgrs = managerRepository.findAllByEmail(oldEmail);

        if (role.contains("MANAGER")) {
            Manager manager = mgrs.isEmpty() ? new Manager() : mgrs.get(0);
            manager.setName(request.getName());
            manager.setEmail(request.getEmail());
            manager.setDepartment(request.getDepartment());
            manager.setDesignation(request.getDesignation());
            managerRepository.save(manager);

            // Clean up other duplicates if they exist
            if (mgrs.size() > 1) {
                for (int i = 1; i < mgrs.size(); i++) {
                    managerRepository.delete(mgrs.get(i));
                }
            }
        } else if (!mgrs.isEmpty()) {
            managerRepository.deleteAll(mgrs);
        }
    }

    @Transactional
    public void repairMissingUsers(List<Employee> employees, List<Manager> managers) {
        for (Employee emp : employees) {
            String email = emp.getEmail();
            if (email != null && !email.isBlank()) {
                if (userRepository.findByEmail(email).isEmpty()) {
                    System.out.println("Repairing missing user for Employee: " + email);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setPassword(passwordEncoder.encode("Welcome@123"));
                    newUser.setRole("EMPLOYEE");
                    userRepository.save(newUser);
                }
            }
        }

        for (Manager mgr : managers) {
            String email = mgr.getEmail();
            if (email != null && !email.isBlank()) {
                if (userRepository.findByEmail(email).isEmpty()) {
                    System.out.println("Repairing missing user for Manager: " + email);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setPassword(passwordEncoder.encode("Welcome@123"));
                    newUser.setRole("MANAGER");
                    userRepository.save(newUser);
                }
            }
        }
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional
    public String addDepartment(Department department) {
        departmentRepository.save(department);
        return "Department added successfully.";
    }

    @Transactional
    public String deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
        return "Department deleted successfully.";
    }

    public List<Map<String, Object>> getAllReviewsWithDetails() {
        List<Review> reviews = reviewRepository.findAllWithDetails();
        return reviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("rating", review.getRating());
            map.put("remarks", review.getRemarks());
            map.put("strengths", review.getStrengths());
            map.put("improvements", review.getImprovements());
            map.put("communication", review.getCommunication());
            map.put("technicalSkills", review.getTechnicalSkills());
            map.put("teamwork", review.getTeamwork());
            map.put("punctuality", review.getPunctuality());
            map.put("managerStatus", review.getManagerStatus());
            map.put("hrRating", review.getHrRating());
            map.put("hrRemarks", review.getHrRemarks());
            map.put("finalDecision", review.getFinalDecision());

            // Employee data with managerName field for frontend
            if (review.getEmployee() != null) {
                Employee emp = review.getEmployee();
                Map<String, Object> empMap = new HashMap<>();
                empMap.put("id", emp.getId());
                empMap.put("name", emp.getName());
                empMap.put("email", emp.getEmail());
                empMap.put("department", emp.getDepartment());
                empMap.put("designation", emp.getDesignation());
                empMap.put("managerName", emp.getManager());
                map.put("employee", empMap);

                // Include self-evaluation data for the View Details modal
                Long cycleId = review.getCycle() != null ? review.getCycle().getId() : null;
                if (cycleId != null) {
                    selfEvaluationRepository.findAllByEmployeeIdAndCycleIdOrderByIdDesc(emp.getId(), cycleId)
                            .stream()
                            .findFirst()
                            .ifPresent(selfEval -> {
                                map.put("achievements", selfEval.getAchievements());
                                map.put("skills", selfEval.getSkills());
                                map.put("organizationalWork", selfEval.getOrganizationWork());
                            });
                }
            }

            // Cycle data
            if (review.getCycle() != null) {
                Map<String, Object> cycleMap = new HashMap<>();
                cycleMap.put("id", review.getCycle().getId());
                cycleMap.put("name", review.getCycle().getName());
                map.put("cycle", cycleMap);
            }

            return map;
        }).toList();
    }

    @Transactional
    public String resetStaff() {
        notificationRepository.deleteAll();
        goalRepository.deleteAll();
        reviewRepository.deleteAll();
        selfEvaluationRepository.deleteAll();
        employeeRepository.deleteAll();
        managerRepository.deleteAll();

        userRepository.findAll().stream()
                .filter(u -> !u.getRole().contains("HR"))
                .forEach(u -> userRepository.delete(u));

        return "All staff data reset successfully.";
    }

    @Transactional
    public Review submitHrReviewStatus(Long reviewId, Integer hrRating, String hrRemarks, String finalDecision) {
        System.out.println(
                "=== HR Review Update === ID: " + reviewId + " Rating: " + hrRating + " Decision: " + finalDecision);

        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            Review review = reviewOptional.get();
            if (review.getHrRating() != null && review.getFinalDecision() != null
                    && !review.getFinalDecision().isBlank()) {
                throw new RuntimeException("HR review already completed for this employee.");
            }
            if (hrRating == null || hrRating < 1 || hrRating > 5) {
                throw new RuntimeException("HR rating must be between 1 and 5.");
            }
            if (finalDecision == null || finalDecision.isBlank()) {
                throw new RuntimeException("Final decision is required.");
            }
            if (!"Approved".equalsIgnoreCase(finalDecision) && !"Needs Rework".equalsIgnoreCase(finalDecision)) {
                throw new RuntimeException("Final decision must be Approved or Needs Rework.");
            }

            review.setHrRating(hrRating);
            review.setHrRemarks(hrRemarks);
            review.setFinalDecision(finalDecision);
            Review savedReview = reviewRepository.save(review);

            // 🔔 Notify Employee
            if (review.getEmployee() != null) {
                String email = review.getEmployee().getEmail();
                userRepository.findByEmail(email).ifPresent(u -> {
                    notificationService.createNotification(
                            u.getId(),
                            "EMPLOYEE",
                            "✨ Your appraisal has been finalized by HR",
                            "HR_REVIEW_COMPLETED");
                });
            }

            return savedReview;
        }
        throw new RuntimeException("Review not found for id: " + reviewId);
    }

}
