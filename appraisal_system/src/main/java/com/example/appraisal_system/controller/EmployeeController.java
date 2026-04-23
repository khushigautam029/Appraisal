package com.example.appraisal_system.controller;

import com.example.appraisal_system.entity.Employee;
import com.example.appraisal_system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private com.example.appraisal_system.repository.UserRepository userRepository;

    @Autowired
    private com.example.appraisal_system.repository.EmployeeRepository employeeRepository;

    @Autowired
    private com.example.appraisal_system.repository.ManagerRepository managerRepository;

    @PostMapping
    public String createEmployee(@RequestBody Employee employee) {
        employeeService.saveEmployee(employee);
        return "Employee inserted successfully!";
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id).orElse(null);
    }

    @GetMapping("/user/{userId}")
    public Employee getEmployeeByUserId(@PathVariable Long userId) {
        com.example.appraisal_system.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Try to find in Employee table
        java.util.Optional<Employee> empOpt = employeeRepository.findByEmail(user.getEmail());
        if (empOpt.isPresent()) {
            return empOpt.get();
        }

        // 2. Fallback: Try to find in Manager table
        java.util.Optional<com.example.appraisal_system.entity.Manager> mgrOpt = managerRepository.findByEmail(user.getEmail());
        if (mgrOpt.isPresent()) {
            com.example.appraisal_system.entity.Manager mgr = mgrOpt.get();
            Employee virtualEmp = new Employee();
            virtualEmp.setId(mgr.getId()); // Use manager ID as temp ID
            virtualEmp.setName(mgr.getName());
            virtualEmp.setEmail(mgr.getEmail());
            virtualEmp.setDepartment(mgr.getDepartment());
            virtualEmp.setDesignation(mgr.getDesignation());
            virtualEmp.setStatus("ACTIVE");
            
            // Managers might not have a manager assigned in the same way, 
            // but we can try to find if anyone lists them as their manager? No, that's reverse.
            // For now, leave manager null or try to find a default.
            virtualEmp.setManager("Not Assigned"); 

            return virtualEmp;
        }

        throw new RuntimeException("No profile found for user: " + user.getEmail());
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deleted successfully!";
    }

//    @GetMapping("/dashboard")
//    public Map<String, Long> getDashboardStats() {
//        List<Employee> employees = employeeService.getAllEmployees();
//
//        long total = employees.size();
//        long pending = employees.stream().filter(e -> "Pending".equals(e.getStatus())).count();
//        long completed = employees.stream().filter(e -> "Completed".equals(e.getStatus())).count();
//
//        Map<String, Long> stats = new HashMap<>();
//        stats.put("employees", total);
//        stats.put("pending", pending);
//        stats.put("completed", completed);
//
//        return stats;
//    }
}