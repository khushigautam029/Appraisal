package com.example.appraisal_system.service;

import com.example.appraisal_system.dto.HrStaffRequest;
import com.example.appraisal_system.entity.*;
import com.example.appraisal_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HrService {

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
        
        List<User> users = userRepository.findAll();

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
        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        String role = request.getPrimaryRole() != null ? request.getPrimaryRole().toUpperCase() : "EMPLOYEE";
        if (request.getSecondaryRole() != null && !request.getSecondaryRole().isEmpty()
                && !request.getSecondaryRole().equalsIgnoreCase("None")) {
            role += "," + request.getSecondaryRole().toUpperCase();
        }
        user.setRole(role);
        userRepository.save(user);

        // Create Employee/Manager record
        if (role.contains("EMPLOYEE")) {
            Employee employee = new Employee();
            employee.setName(request.getName());
            employee.setEmail(request.getEmail());
            employee.setDepartment(request.getDepartment());
            employee.setDesignation(request.getDesignation());
            employee.setManager(request.getManager());
            employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
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
                employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
                employeeRepository.save(employee);
            }

            handleEmployeeAssignments(request.getName(), request.getEmployeeIds());
        }

        emailService.sendWelcomeEmail(request.getEmail(), request.getName(), role, request.getPassword());
        return "Staff added successfully.";
    }

    @Transactional
    public String updateStaff(Long id, HrStaffRequest request) {
        System.out.println("=== updateStaff called === id=" + id + " email=" + request.getEmail() + " name=" + request.getName() + " role=" + request.getPrimaryRole() + " manager=" + request.getManager());

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
            user.setPassword(request.getPassword() != null && !request.getPassword().isEmpty() ? request.getPassword() : "Welcome@123");
        }

        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword());
        }

        String role = primaryRole;
        if (request.getSecondaryRole() != null && !request.getSecondaryRole().isEmpty()
                && !request.getSecondaryRole().equalsIgnoreCase("None")) {
            role += "," + request.getSecondaryRole().toUpperCase();
        }
        user.setRole(role);
        userRepository.save(user);

        // 3. FLUSH and CLEAR the persistence context BEFORE touching Employee/Manager tables
        //    This prevents stale/corrupt entities from causing PropertyValueException
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
            // For managers, we also need to update their OWN employee record if they report to someone
            updateEmployeeRecord(oldEmail, request, "EMPLOYEE,MANAGER"); 
            
            handleEmployeeAssignments(request.getName(), request.getEmployeeIds());
        }

        return "Staff updated successfully.";
    }

    private void handleEmployeeAssignments(String managerName, List<Long> employeeIds) {
        if (employeeIds == null) return;
        
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
            if (email == null) email = mgr.getEmail();
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
            if (email == null) email = user.getEmail();
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
            employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
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
                    newUser.setPassword("Welcome@123");
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
                    newUser.setPassword("Welcome@123");
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

    public List<Review> getAllReviews() {
        return reviewRepository.findAllWithDetails();
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
    public Review submitHrReviewStatus(Long reviewId, Integer hrRating, String hrRemarks) {
        System.out.println("=== HR Review Update === ID: " + reviewId + " Rating: " + hrRating);
        
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            Review review = reviewOptional.get();
            review.setHrRating(hrRating);
            review.setHrRemarks(hrRemarks);
            Review savedReview = reviewRepository.save(review);
            
            // 🔔 Notify Employee
            if (review.getEmployee() != null) {
                String email = review.getEmployee().getEmail();
                userRepository.findByEmail(email).ifPresent(u -> {
                    notificationService.createNotification(
                        u.getId(),
                        "EMPLOYEE",
                        "✨ Your appraisal has been finalized by HR",
                        "HR_REVIEW_COMPLETED"
                    );
                });
            }
            
            return savedReview;
        }
        throw new RuntimeException("Review not found for id: " + reviewId);
    }
}
