# JWT Authentication System Guide

## Overview
This project implements a robust JWT (JSON Web Token) based authentication system with proper security measures, rate limiting, and role-based access control.

## Authentication Flow

### 1. User Registration
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isAdmin": false
  }
}
```

### 2. User Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Alternative login with username:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome back, John!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isAdmin": false
  }
}
```

### 3. Token Usage
For all protected routes, include the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Token Refresh
```http
POST /api/user/refresh-token
Authorization: Bearer <expired_or_expiring_token>
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Token refreshed successfully"
}
```

## API Endpoints

### Public Endpoints (No Authentication)
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/clubs/` - Get all clubs (public view)
- `GET /api/clubs/:id` - Get single club (public view)
- `GET /api/jobs/` - Get all jobs (public view)
- `GET /api/jobs/:id` - Get single job (public view)

### Protected Endpoints (Authentication Required)
#### User Management
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `POST /api/user/logout` - Logout (client-side token removal)
- `POST /api/user/refresh-token` - Refresh JWT token

#### Club Management
- `POST /api/clubs/` - Create new club
- `PUT /api/clubs/:id` - Update club (owner or admin only)

#### Job Management
- `POST /api/jobs/` - Create new job
- `GET /api/jobs/my/jobs` - Get current user's jobs
- `PATCH /api/jobs/:id` - Update job (owner or admin only)

### Admin Only Endpoints
- `GET /api/user/users` - Get all users
- `DELETE /api/user/users/:id` - Delete user
- `GET /api/user/test` - Admin test endpoint
- `DELETE /api/clubs/:id` - Delete club
- `DELETE /api/jobs/:id` - Delete job

## Security Features

### 1. Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Minimum password requirements can be enforced
- Password change requires current password verification

### 2. JWT Security
- Tokens expire after 7 days (configurable)
- Tokens include user ID, username, email, and admin status
- Token refresh available for up to 1 hour after expiry
- Invalid/expired tokens are properly handled

### 3. Rate Limiting
- Login attempts are limited to 5 per IP address per 15 minutes
- Automatic reset after time window expires

### 4. Input Validation
- Required field validation
- Email format validation
- Duplicate username/email prevention
- Sanitized database queries

### 5. Authorization Levels
- **Public**: No authentication required
- **User**: Valid JWT token required
- **Owner**: User can only modify their own resources
- **Admin**: Full access to all resources

## Error Handling

### Authentication Errors
```json
{
  "success": false,
  "error": "Access token required. Please provide a valid Bearer token."
}
```

### Token Expiry
```json
{
  "success": false,
  "error": "Token has expired. Please login again."
}
```

### Invalid Credentials
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### Insufficient Permissions
```json
{
  "success": false,
  "error": "Admin privileges required to access this resource"
}
```

### Rate Limiting
```json
{
  "success": false,
  "error": "Too many login attempts. Please try again later."
}
```

## Frontend Integration

### 1. Token Storage
Store JWT token in localStorage or sessionStorage:

```javascript
// After successful login
const response = await fetch('/api/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

### 2. API Requests with Token
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Axios Interceptor (Recommended)
```javascript
// Set up Axios interceptor for automatic token inclusion
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Protected Route Component
```javascript
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || !user._id) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Usage
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

## Environment Variables

Add these to your `/backend/data/config.env` file:

```env
# Database
MONGO_URI2=mongodb://localhost:27017/gaurav-resume

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Testing the Authentication

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 3. Access protected route
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Best Practices

### 1. Token Management
- Store tokens securely (httpOnly cookies for web apps)
- Implement token refresh logic
- Clear tokens on logout
- Handle token expiry gracefully

### 2. Security
- Use HTTPS in production
- Implement CSRF protection
- Validate all inputs
- Use environment variables for secrets
- Implement proper logging

### 3. Error Handling
- Don't expose sensitive information in errors
- Use consistent error response format
- Log security events
- Implement monitoring and alerting

### 4. Performance
- Cache user data when appropriate
- Use database indexes
- Implement pagination for large datasets
- Monitor API performance

This JWT authentication system provides a secure, scalable foundation for your application with proper error handling, rate limiting, and role-based access control. 