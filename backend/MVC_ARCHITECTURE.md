# MVC Architecture Documentation

## Overview
This project has been refactored to follow the **Model-View-Controller (MVC)** design pattern, providing better separation of concerns, maintainability, and scalability.

## Architecture Structure

```
backend/
├── controllers/          # Controller Layer - Handle HTTP requests/responses
│   ├── user.js          # User-related operations
│   ├── club.js          # Club-related operations  
│   └── job.js           # Job-related operations
├── models/               # Model Layer - Data structure and database operations
│   ├── userModel.js     # User schema and model
│   ├── ClubModel.js     # Club schema and model
│   └── JobSchema.js     # Job schema and model
├── routes/               # Route Layer - URL mapping to controllers
│   ├── userRoute.js     # User API endpoints
│   ├── ClubRoute.js     # Club API endpoints
│   └── jobRoute.js      # Job API endpoints
├── middleware/           # Middleware - Cross-cutting concerns
│   ├── auth.js          # Authentication and authorization
│   └── error.js         # Error handling
├── services/             # Service Layer - Business logic
│   └── userService.js   # User business logic
├── utils/                # Utility functions
│   └── features.js      # Helper functions
├── data/                 # Database configuration
│   └── dbConnect.js     # Database connection
└── server.js            # Application entry point
```

## Layer Responsibilities

### 1. Model Layer (`/models/`)
**Purpose**: Defines data structure and handles database operations

- **userModel.js**: User schema with fields like username, email, password, etc.
- **ClubModel.js**: Club schema with club details, members, announcements
- **JobSchema.js**: Job schema with job details, requirements, eligibility

**Key Features**:
- Mongoose schemas with validation
- Consistent data structure
- Built-in timestamps
- Type definitions

### 2. View Layer (Frontend - React Components)
**Purpose**: User interface and presentation logic

Located in `/FrontEnd/src/`:
- **components/**: Reusable UI components
- **pages/**: Page-level components
- **App.js**: Main application component with routing

### 3. Controller Layer (`/controllers/`)
**Purpose**: Handle HTTP requests, process data, and return responses

#### User Controller (`user.js`)
- `register()` - User registration
- `login()` - User authentication  
- `logout()` - User logout
- `updateUser()` - Update user profile
- `getProfile()` - Get user details
- `test()` - API health check

#### Club Controller (`club.js`)
- `createClub()` - Create new club with image upload
- `updateClub()` - Update club details
- `getClubById()` - Get single club
- `getAllClubs()` - Get all clubs
- `deleteClub()` - Delete club (admin only)

#### Job Controller (`job.js`)
- `createJob()` - Create new job posting
- `getAllJobs()` - Get all jobs
- `getJobById()` - Get single job
- `updateJob()` - Update job details
- `deleteJob()` - Delete job (admin only)

### 4. Route Layer (`/routes/`)
**Purpose**: Map URLs to controller functions and apply middleware

#### User Routes (`userRoute.js`)
```javascript
POST   /api/user/register     - User registration
POST   /api/user/login        - User login
POST   /api/user/logout       - User logout (protected)
GET    /api/user/profile      - Get profile (protected)
PUT    /api/user/update       - Update profile (protected)
GET    /api/user/test         - Admin test (admin only)
```

#### Club Routes (`ClubRoute.js`)
```javascript
GET    /api/clubs/            - Get all clubs
GET    /api/clubs/:id         - Get club by ID
POST   /api/clubs/            - Create club (protected)
PUT    /api/clubs/:id         - Update club (protected)
DELETE /api/clubs/:id         - Delete club (admin only)
```

#### Job Routes (`jobRoute.js`)
```javascript
GET    /api/jobs/             - Get all jobs
GET    /api/jobs/:id          - Get job by ID
POST   /api/jobs/             - Create job (protected)
PATCH  /api/jobs/:id          - Update job (protected)
DELETE /api/jobs/:id          - Delete job (admin only)
```

### 5. Middleware Layer (`/middleware/`)
**Purpose**: Handle cross-cutting concerns

#### Authentication Middleware (`auth.js`)
- `authenticateToken()` - Verify JWT tokens
- `requireAdmin()` - Check admin privileges
- `optionalAuth()` - Optional authentication
- `checkOrganization()` - Organization membership check

#### Error Middleware (`error.js`)
- `AppError` - Custom error class
- `errorHandler()` - Global error handling
- `notFound()` - 404 error handler
- `asyncHandler()` - Async function wrapper

### 6. Service Layer (`/services/`)
**Purpose**: Business logic and data processing

#### User Service (`userService.js`)
- `createUser()` - User creation logic
- `authenticateUser()` - Authentication logic
- `generateToken()` - JWT token generation
- `getUserById()` - Get user data
- `updateUser()` - Update user logic
- `getAllUsers()` - Get all users (admin)
- `deleteUser()` - Delete user (admin)

## Key Improvements Made

### 1. **Separation of Concerns**
- Removed route handlers from `server.js`
- Created dedicated controllers for each entity
- Separated business logic into service layer
- Organized middleware for reusability

### 2. **Consistent Error Handling**
- Custom `AppError` class
- Global error handling middleware
- Consistent error response format
- Proper HTTP status codes

### 3. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (admin/user)
- Protected route middleware
- Token validation and refresh

### 4. **Code Organization**
- Modular file structure
- Consistent naming conventions
- Clear responsibility boundaries
- Reusable components

### 5. **API Standardization**
- RESTful API design
- Consistent response format
- Proper HTTP methods
- Status code standards

## Response Format

All API responses follow this format:

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response  
{
  "success": false,
  "error": "Error message",
  "stack": "..." // Only in development
}
```

## Authentication Flow

1. **Registration**: `POST /api/user/register`
   - Validate input data
   - Check if user exists
   - Hash password
   - Create user
   - Return JWT token

2. **Login**: `POST /api/user/login`
   - Validate credentials
   - Compare password hash
   - Generate JWT token
   - Return user data + token

3. **Protected Routes**: 
   - Client sends `Authorization: Bearer <token>`
   - Server validates token
   - Extracts user data
   - Proceeds with request

## File Upload Handling

Clubs support image uploads with:
- Multer middleware configuration
- File validation
- Unique filename generation
- Storage in `/FrontEnd/src/images/`

## Environment Variables

Required in `/backend/data/config.env`:
```env
MONGO_URI2=mongodb://localhost:27017/gaurav-resume
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

## Future Enhancements

1. **Validation Layer**: Add input validation middleware
2. **Caching**: Implement Redis for better performance
3. **Rate Limiting**: Add API rate limiting
4. **Logging**: Implement structured logging
5. **Testing**: Add unit and integration tests
6. **Documentation**: Auto-generate API documentation

## Usage Examples

### Creating a Club
```javascript
// POST /api/clubs/
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data

FormData:
- title: "Programming Club"
- category: "Technical"
- description: "Learn coding together"
- image: <file>
```

### Getting User Profile
```javascript
// GET /api/user/profile
// Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

This MVC architecture provides a solid foundation for scalable web application development with clear separation of concerns and maintainable code structure. 

## Summary of MVC Refactoring

I have successfully refactored your codebase to follow the **MVC (Model-View-Controller)** design pattern. Here's a comprehensive summary of the changes made:

## 🔄 **Major Changes Made**

### **1. Controller Layer Refactoring**
- ✅ **Cleaned up `user.js`** - Removed duplicate functions, improved error handling
- ✅ **Completely rewrote `club.js`** - Added all CRUD operations with proper structure
- ✅ **Created `job.js`** - New controller for job operations (previously in server.js)

### **2. Routes Layer Organization**
- ✅ **Updated `userRoute.js`** - Clean routing with proper middleware
- ✅ **Refactored `ClubRoute.js`** - RESTful API design
- ✅ **Created `jobRoute.js`** - New route file for job endpoints

### **3. Middleware Layer Enhancement**
- ✅ **Improved `auth.js`** - Better JWT handling, admin checks, optional auth
- ✅ **Enhanced `error.js`** - Custom error classes, global error handling

### **4. Service Layer Addition**
- ✅ **Created `userService.js`** - Business logic separation

### **5. Server.js Cleanup**
- ✅ **Removed all route handlers** - Moved to appropriate controllers
- ✅ **Clean structure** - Only configuration and middleware setup
- ✅ **Proper error handling** - Global error middleware

### **6. Documentation**
- ✅ **Created `MVC_ARCHITECTURE.md`** - Comprehensive documentation
- ✅ **Visual diagram** - Mermaid diagram showing architecture flow

## 🎯 **Key Benefits Achieved**

1. **Separation of Concerns** - Each layer has clear responsibilities
2. **Maintainability** - Code is organized and easy to modify
3. **Scalability** - Easy to add new features and controllers
4. **Error Handling** - Consistent error responses across the app
5. **Security** - Proper JWT authentication and authorization
6. **Code Reusability** - Modular components and middleware

## 🔧 **API Endpoints (Updated)**

### **User API**
```
POST   /api/user/register     - User registration
POST   /api/user/login        - User login  
POST   /api/user/logout       - User logout (protected)
GET    /api/user/profile      - Get profile (protected)
PUT    /api/user/update       - Update profile (protected)
GET    /api/user/test         - Admin test (admin only)
```

### **Club API** 
```
GET    /api/clubs/            - Get all clubs
GET    /api/clubs/:id         - Get club by ID
POST   /api/clubs/            - Create club (protected)
PUT    /api/clubs/:id         - Update club (protected)
DELETE /api/clubs/:id         - Delete club (admin only)
```

### **Job API**
```
GET    /api/jobs/             - Get all jobs
GET    /api/jobs/:id          - Get job by ID
POST   /api/jobs/             - Create job (protected)
PATCH  /api/jobs/:id          - Update job (protected)
DELETE /api/jobs/:id          - Delete job (admin only)
```

## 🚀 **Next Steps to Test**

1. **Update Frontend API calls** to match new endpoints:
   - Change `/create-club` to `/api/clubs/`
   - Change `/jobs` to `/api/jobs/` 
   - Change `/clubs` to `/api/clubs/`

2. **Update Authentication headers**:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

3. **Test the new structure**:
   ```bash
   cd backend
   npm start
   ```

4. **Verify all endpoints** work with the new structure

## 📁 **File Structure Summary**

```
backend/
├── controllers/          # ✅ All business logic
│   ├── user.js          # ✅ Refactored
│   ├── club.js          # ✅ Complete rewrite
│   └── job.js           # ✅ New file
├── routes/               # ✅ Clean routing
│   ├── userRoute.js     # ✅ Updated
│   ├── ClubRoute.js     # ✅ Refactored
│   └── jobRoute.js      # ✅ New file
├── middleware/           # ✅ Enhanced middleware
│   ├── auth.js          # ✅ Better JWT handling
│   └── error.js         # ✅ Global error handling
├── services/             # ✅ New layer
│   └── userService.js   # ✅ Business logic
├── models/               # ✅ Existing (good)
├── utils/                # ✅ Existing utilities
├── data/                 # ✅ Database config
├── server.js            # ✅ Clean entry point
└── MVC_ARCHITECTURE.md  # ✅ Documentation
```

Your codebase now follows proper MVC architecture with clear separation of concerns, better error handling, and improved maintainability! 🎉 