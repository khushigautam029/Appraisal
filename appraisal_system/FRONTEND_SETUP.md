# Frontend API Configuration

## Problem
The frontend on Vercel is receiving 404 errors because it's not configured with the correct backend API URL. The frontend needs to know where the backend server is located.

## Solution

### 1. Backend Health Check
The backend now exposes two public endpoints for configuration:

```
GET /api/health - Health check endpoint
GET /api/config - Returns backend configuration including baseUrl
```

### 2. Frontend Environment Variables

Set the following environment variables in your frontend deployment (Vercel, local dev, etc):

```bash
REACT_APP_API_URL=https://your-backend-url:8080
# or for development
REACT_APP_API_URL=http://localhost:8080
```

### 3. Frontend API Client Configuration

Update your frontend API client (axios, fetch, etc) to use the environment variable:

```javascript
// src/services/api.js (or similar)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 4. Available API Endpoints

#### Public Endpoints (no authentication required)
- `GET /api/health` - Backend health check
- `GET /api/config` - Get backend configuration
- `POST /auth/login` - User login

#### Protected Endpoints (authentication required)
All other endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### 5. Example API Calls

**Get Notifications:**
```
GET {API_BASE_URL}/notifications/1?role=HR
```

**Get Appraisal Cycles:**
```
GET {API_BASE_URL}/cycles
```

**Get HR Dashboard:**
```
GET {API_BASE_URL}/hr/dashboard
```

### 6. Deployment on Vercel

1. Go to Vercel Project Settings → Environment Variables
2. Add the following variables:

```
REACT_APP_API_URL = https://your-ec2-backend-domain.com:8080
```

Or if using the EC2 public IP:
```
REACT_APP_API_URL = https://ec2-public-ip:8080
```

### 7. Local Development

For local development, set:
```bash
REACT_APP_API_URL=http://localhost:8080
```

Then start your backend (on port 8080) and frontend separately.

### 8. CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:4200` (Angular default)
- `http://localhost:5173` (Vite default)
- `https://appraisal-frontend-gold.vercel.app`
- `https://mumbling-grout-glandular.ngrok-free.dev` (for ngrok)

If using a different frontend URL, add it to `SecurityConfig.java` in the CORS configuration.

## Summary

**Root Cause:** Frontend was making API calls to itself instead of the backend server.

**Fix:** Set `REACT_APP_API_URL` environment variable to point to the backend server (e.g., `https://your-ec2-domain:8080` for production or `http://localhost:8080` for local development).

**Testing:** 
1. Frontend should now make successful API calls
2. All endpoints should return proper data (404s should be gone)
3. Auth tokens should be properly sent in request headers
