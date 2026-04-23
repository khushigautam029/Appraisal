# Appraisal System API - Postman Collection

This Postman collection contains all the API endpoints for the Employee Appraisal System.

## Setup Instructions

1. **Import the Collection**:
   - Open Postman
   - Click "Import" button
   - Select "File" tab
   - Choose `Appraisal_System_Postman_Collection.json`

2. **Configure Environment Variables**:
   - Create a new environment in Postman
   - Set the following variables:
     - `baseUrl`: `http://localhost:8080` (default Spring Boot port)
     - `authToken`: Leave empty (will be set automatically after login)

## API Endpoints Overview

### Authentication
- **POST** `/auth/login` - User login (returns JWT token)

### Employees
- **GET** `/employee` - Get all employees
- **GET** `/employee/{id}` - Get employee by ID
- **GET** `/employee/user/{userId}` - Get employee by user ID
- **POST** `/employee` - Create new employee
- **PUT** `/employee/{id}` - Update employee
- **DELETE** `/employee/{id}` - Delete employee

### Appraisal Cycles
- **GET** `/cycles` - Get all cycles
- **GET** `/cycles/{id}` - Get cycle by ID
- **POST** `/cycles` - Create new cycle
- **PUT** `/cycles/{id}` - Update cycle
- **DELETE** `/cycles/{id}` - Delete cycle

### Goals
- **GET** `/api/goals` - Get all goals
- **GET** `/api/goals/employee/{empId}` - Get goals by employee
- **GET** `/api/goals/cycle/{cycleId}` - Get goals by cycle
- **GET** `/api/goals/user/{userId}` - Get goals by user
- **GET** `/api/goals/manager` - Get goals for manager
- **POST** `/api/goals/employee/{empId}/cycle/{cycleId}` - Create goal
- **PUT** `/api/goals/{goalId}` - Update goal
- **PUT** `/api/goals/{goalId}/submit` - Submit goal
- **PUT** `/api/goals/{goalId}/status` - Update goal status
- **DELETE** `/api/goals/{id}` - Delete goal

### Self Evaluations
- **GET** `/evaluations/employee/{empId}` - Get evaluations by employee
- **GET** `/evaluations/cycle/{cycleId}` - Get evaluations by cycle
- **GET** `/evaluations/employee/{empId}/cycle/{cycleId}` - Get evaluation by employee and cycle
- **POST** `/evaluations/employee/{empId}/cycle/{cycleId}` - Create self evaluation
- **PUT** `/evaluations/submit/{id}` - Submit self evaluation
- **DELETE** `/evaluations/{id}` - Delete self evaluation

### Manager Reviews
- **GET** `/review` - Get all reviews
- **GET** `/review/{employeeId}` - Get reviews by employee
- **GET** `/review/{employeeId}/cycle/{cycleId}` - Get review by employee and cycle
- **POST** `/review/{employeeId}/cycle/{cycleId}` - Create manager review

### HR Operations
- **GET** `/hr/dashboard` - Get HR dashboard
- **GET** `/hr/staff` - Get all staff
- **POST** `/hr/staff` - Create staff member
- **PUT** `/hr/staff/{id}` - Update staff member
- **DELETE** `/hr/staff/{id}` - Delete staff member
- **GET** `/hr/departments` - Get all departments
- **POST** `/hr/departments` - Create department
- **DELETE** `/hr/departments/{id}` - Delete department
- **GET** `/hr/reviews` - Get all reviews (HR view)
- **PUT** `/hr/reviews/{id}` - Update review status
- **POST** `/hr/reset-staff` - Reset staff passwords

### Manager Operations
- **GET** `/manager/dashboard` - Get manager dashboard
- **GET** `/manager/team-status` - Get team status
- **GET** `/manager/reports` - Get manager reports
- **GET** `/manager/employees` - Get manager's employees
- **POST** `/manager/assign-target` - Assign target to employee
- **DELETE** `/manager/goal/{id}` - Delete goal

### Notifications
- **GET** `/notifications/{userId}` - Get user notifications
- **GET** `/notifications/{userId}/unread` - Get unread notifications
- **PUT** `/notifications/{id}/read` - Mark notification as read
- **POST** `/notifications/{userId}` - Create notification

### Dashboard
- **GET** `/api/dashboard/user/{userId}/cycle/{cycleId}` - Get user dashboard

### Email
- **GET** `/email/send` - Send email

### Health Check
- **GET** `/api/health` - Health check
- **GET** `/api/config` - Get configuration

## Authentication

Most endpoints require authentication. The collection is configured to:

1. Use the `authToken` variable in the Authorization header
2. Automatically save the token after successful login
3. Include `Bearer {{authToken}}` in requests

## Usage Tips

1. **Start with Login**: Always run the login request first to get the JWT token
2. **Check Response Codes**: Look for 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found)
3. **Update IDs**: Replace placeholder IDs (like `1`) with actual IDs from your database
4. **Environment Variables**: Update `baseUrl` if your server runs on a different port

## Sample Data

The collection includes sample request bodies for POST/PUT requests. You may need to modify these based on your actual data structure.

## Error Handling

- 401 Unauthorized: Check if token is valid or login again
- 403 Forbidden: User doesn't have permission for this action
- 404 Not Found: Resource doesn't exist
- 400 Bad Request: Invalid request data
- 500 Internal Server Error: Server-side error

## Testing

You can use Postman's built-in testing features to validate responses and automate testing workflows.