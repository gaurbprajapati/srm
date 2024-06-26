

![flow chart](https://github.com/gaurbprajapati/srm/assets/91283293/2824c7dc-9f3a-4099-9947-6392e62dbd7f)

![bPBDxjem4CJlUGgBE-AUGmM2VhHg9TIFzeA477i9JXqxiZVYKFNTwsosIGekqfzJjFkRORAJRKGPi6zjOU620hq8fhwYq2Q0GkDTKNHI_PGrYDNUMpiylEkhbVXLYFIRTb-mr-2Gv_JJ4cKbOrhkbFAzmvFx95sYMm9b57ASPnJ7u1jGIN40bCP6mZiQvl3F4FiMJkujE0WIVI0-q3I3xs](https://github.com/gaurbprajapati/srm/assets/91283293/eb24b758-476d-463b-8378-12167be2d26d)



![teacher db and web-app access](https://github.com/gaurbprajapati/srm/assets/91283293/291fad20-27d5-40dd-90d6-5249b8fb6732)

![Student db and web-app access](https://github.com/gaurbprajapati/srm/assets/91283293/d075a7ad-01db-44b3-8403-52a555ee9048)


![student web-app action allows](https://github.com/gaurbprajapati/srm/assets/91283293/655d8184-3ca6-441f-b2ff-348ff15399e7)


![teacher web-app action allows](https://github.com/gaurbprajapati/srm/assets/91283293/f2eb67a2-8ae7-4646-8821-d5fa9b8a4ee7)

```markdown
# MERN-SRM
## Overview
The MERN SRM (student relationship management) project is a web application that enables users to effortlessly create and manage their resumes. It offers an intuitive user interface to add personal information, education details, work experiences, skills, and more. Additionally, the project provides customizable resume templates for PDF downloads and an upcoming feature for generating QR codes for resumes.

## Technologies Used
- MongoDB: A NoSQL database used for storing application data.
- Express.js: A backend framework for building APIs in Node.js.
- React.js: A JavaScript library for constructing user interfaces.
- Node.js: A runtime environment for server-side JavaScript.

## Setup Instructions
Follow these steps to set up the MERN SRM project on your local machine:

### Step 1: Clone the Repository
```bash
git clone <repository_url>
```

### Step 2: Navigate to the Project Directory
```bash
cd mern-resume-builder
```

### Step 3: Install Dependencies
```bash
# Navigate to the Beckend directory
cd Backend

# Install backend dependencies
npm install

# Navigate to the Frontend directory
cd Frontend

# Install Frontend-side dependencies
npm install
```

### Step 4: Set Up MongoDB
Make sure you have MongoDB installed and running. Update the MongoDB connection URL in `config/default.json` with your MongoDB configuration.

### Step 5: Start the Application
```bash
# Start the backend server
npm run server

# Start the React app (in the FrontEnd directory)
npm start
```

## APIs and Endpoints
The MERN Resume Builder project provides the following APIs and endpoints:

### 1. Registration API (POST)
Endpoint: `/api/register`
Description: Allows users to register by providing their email, password, and other optional details.
Example Request Body:
```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "name": "John Doe",
  "mobileNumber": "1234567890"
}
```

### 2. Login API (POST)
Endpoint: `/api/login`
Description: Authenticates users based on their email and password and returns a JWT token for further requests.
Example Request Body:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### 3. User Info API (GET)
Endpoint: `/api/user`
Description: Retrieves the user's information based on the provided JWT token.
Authorization: JWT token in headers
Example Response:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "mobileNumber": "1234567890",
  "education": [
    {
      "degree": "Bachelor of Science",
      "university": "Example University",
      "year": 2020
    }
  ],
  "skills": ["MongoDB", "Express.js", "React.js", "Node.js"],
  "experience": [
    {
      "company": "Example Company",
      "position": "Software Engineer",
      "start_date": "2021-01-01",
      "end_date": "2022-12-31"
    }
  ],
  "projects": [
    {
      "name": "Project 1",
      "description": "A web application built with the MERN stack.",
      "url": "https://project1.example.com"
    }
  ]
}
```

### 4. Update User API (PUT)
Endpoint: `/api/update`
Description: Allows users to update their profile details.
Authorization: JWT token in headers
Example Request Body (to update name and mobileNumber):
```json
{
  "name": "John Doe",
  "mobileNumber": "1234567890",
  "education": [
    {
      "degree": "Bachelor of Science",
      "university": "Example University",
      "year": 2020
    }
  ],
  "skills": ["MongoDB", "Express.js", "React.js", "Node.js"],
  "experience": [
    {
      "company": "Example Company",
      "position": "Software Engineer",
      "start_date": "2021-01-01",
      "end_date": "2022-12-31"
    }
  ],
  "projects": [
    {
      "name": "Project 1",
      "description": "A web application built with the MERN stack.",
      "url": "https://project1.example.com"
    }
  ]
}
```

### 5. Logout API (POST)
Endpoint: `/api/logout`
Description: Logs out the user and invalidates the JWT token.

## Usage and Features
The MERN Resume Builder project offers the following functionalities:

1. Registration: Users can create an account by providing their email, password, and optional details.
2. Login: Registered users can log in using their credentials to access their profiles.
3. Profile Management: Users can view and update personal details, education, work experiences, skills, and projects.
4. PDF Download: Users can download their resume in PDF format using customizable templates.
5. QR Resume (Upcoming): The project will soon introduce QR code generation for resumes.

## Contribution Guidelines
Contributions to the MERN Resume Builder project are encouraged! To contribute:

1. Fork the repository and create a new branch for your changes.
2. Make and commit your changes to the branch.
3. Push your changes to your forked repository.
4. Create a pull request with a detailed description of your modifications.
5. Await code review and feedback from maintainers.

Thank you for your interest in contributing!

## License
This project is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT). You're welcome to use and modify the code to suit your needs.
```

Feel free to use this template for your MERN Resume Builder project's README, adapting it to your project's specific details and structure.
