# Database Seeding Guide

## Overview
The application uses **DatabaseSeeder** (DataInitializer.java) to populate the database with test data on startup.

## ✅ Password Security Implementation

### BCrypt Hashing & Salting
- **Algorithm**: BCryptPasswordEncoder (strength=10)
- **Salt**: Each password gets a unique salt automatically generated
- **One-way**: Passwords cannot be recovered from database
- **Protection**: Resistant to brute-force and rainbow table attacks

### How It Works
```java
// When user registers/seeds:
String plainPassword = "hr123";
String hashedPassword = passwordEncoder.encode(plainPassword);
// Result: $2a$10$...(unique salt + hash)

// When user logs in:
boolean matches = passwordEncoder.matches(plainPassword, hashedPassword);
// BCrypt automatically extracts salt and re-hashes for comparison
```

## 🔧 Reset & Reseed

### Option 1: Full Database Reset
```sql
-- Delete all tables (MySQL example)
DROP DATABASE appraisal_system;
CREATE DATABASE appraisal_system;
```

### Option 2: Clear Data Only
```sql
DELETE FROM goals;
DELETE FROM self_evaluations;
DELETE FROM reviews;
DELETE FROM notifications;
DELETE FROM employees;
DELETE FROM managers;
DELETE FROM appraisal_cycles;
DELETE FROM departments;
DELETE FROM users;
```

### Option 3: Auto-Seed on Restart
After clearing data, simply restart the application. The DatabaseSeeder runs automatically and checks:
```java
if (userRepository.count() > 0) {
    System.out.println("✅ Data already seeded, skipping.");
    return;  // Prevents duplicate seeding
}
```

## 👥 Test Credentials

All passwords meet validation requirements (minimum 6 characters, @Size constraint).

### HR Users
```
Email: hr@psi.local
Password: Hr@psi123
Role: HR

Email: bob.hr@psi.local
Password: BobHr@123
Role: HR
```

### Managers
```
Email: manager@psi.local
Password: Manager@123
Role: MANAGER

Email: carol.sales@psi.local
Password: Carol@Sales123
Role: MANAGER

Email: alice.manager@psi.local
Password: Alice@Manager123
Role: MANAGER
```

### Employees
```
Email: employee@psi.local
Password: Emp@psi123
Role: EMPLOYEE

Email: jane.smith@psi.local
Password: Jane@Smith123
Role: EMPLOYEE

Email: emily.hr@psi.local
Password: Emily@Hr123
Role: EMPLOYEE

Email: frank.sales@psi.local
Password: Frank@Sales123
Role: EMPLOYEE

Email: john.doe@psi.local
Password: John@Doe123
Role: EMPLOYEE
```

## 🧪 Test in Postman

### Login Endpoint (Role NOT Required)
```
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "hr@psi.local",
  "password": "Hr@psi123"
}
```

**Note:** Only send `email` and `password`. Role is automatically fetched from database.

### Health Check Endpoint (Local Development)
```
GET http://localhost:8080/auth/health
```

### Expected Response (Success)
```json
{
  "token": "eyJhbGc...",
  "id": 1,
  "role": "HR",
  "email": "hr@psi.local",
  "name": "HR Admin",
  "status": "success"
}
```

### Expected Response (Invalid Credentials)
```json
401 Unauthorized
{
  "error": "Invalid email or password"
}
```

## 📊 Seeded Data Structure

### Departments
- Engineering
- HR
- Sales

### Managers
- Alice Manager (Engineering)
- Bob HR (HR)
- Carol Sales (Sales)

### Employees
- 8 employees distributed across departments
- Each has a performance goal for 2026 cycle
- Each has a review from 2025 cycle

### Appraisal Cycles
- **2026**: Active (Jan 1 - Dec 31, 2026)
- **2025**: Completed (Jan 1 - Dec 31, 2025)

## 🚀 Application Startup Flow

```
1. Spring Boot starts
2. JPA creates/validates tables
3. DataInitializer.run() executes
4. Check if users exist
   ├─ YES: Skip seeding (idempotent)
   └─ NO: Execute seed methods
       ├─ seedUsers() - Create users with BCrypt hashed passwords
       ├─ seedCoreData() - Create departments, managers, cycles
       ├─ seedEmployeesAndGoals() - Create employees and goals
       ├─ seedReviewsAndEvaluations() - Create reviews
       └─ seedNotifications() - Create notifications
5. Log "DATABASE INITIALIZATION COMPLETE"
6. Application ready to use
```

## ⚠️ Common Issues

### "Invalid credentials" in Postman
**Problem**: Password is stored in plain text in database
**Solution**: Delete database and restart to trigger fresh seeding with hashed passwords

### "Data already seeded, skipping"
**Problem**: Trying to reseed without clearing data first
**Solution**: Clear database tables or restart application after clearing

### BCrypt not working
**Problem**: PasswordEncoder not configured
**Solution**: Check SecurityConfig has `@Bean public PasswordEncoder passwordEncoder()`

## 📝 Notes

- All passwords are environment-independent (works on any machine)
- Seeding is idempotent (safe to run multiple times)
- Test credentials follow pattern: `{role}@psi.local`
- Each database reset gets fresh salts - passwords in database will be different
