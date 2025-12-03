# StudyNotion-EdTech
A Full Stack MERN Based Web Project

StudyNotion is a full-stack MERN EdTech platform where users can browse courses, purchase them, access dashboards, manage their learning progress, and interact with a clean and structured UI. The project includes a complete authentication system, course management, payments, and a production-ready backend.

## Overview

StudyNotion is designed to provide a simple and effective learning experience. Users can sign up, log in, explore courses, watch content, and manage their profile. The platform also includes admin and instructor-focused functionality such as course creation, section management, and content upload.

## Features

- User registration and login
- JWT-based authentication
- Course browsing page
- Course details page
- Course purchase using Razorpay
- User dashboard with enrolled courses
- Instructor features for creating and managing courses
- Content management with sections and subsections
- Secure backend APIs
- Cloud media storage support
- Responsive frontend
- Centralized global state for user and course data

## Tech Stack

### Frontend
- React
- Redux / Context API
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Razorpay for payments
- Cloudinary for media storage
- JWT authentication
- Bcrypt for password hashing

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/studynotion.git
```

Navigate to the project folder:

```bash
cd studynotion
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Running the Project

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder and add the following variables:

```
MONGODB_URL=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Create a `.env` file in the frontend (if needed):

```
VITE_BACKEND_URL=
```

## API Endpoints

### Auth Routes
- POST /auth/signup
- POST /auth/login
- POST /auth/reset-password

### Course Routes
- GET /courses
- GET /courses/:id
- POST /courses/create
- POST /courses/add-section
- POST /courses/add-subsection

### Payment Routes
- POST /payments/capture
- POST /payments/verify

### Profile Routes
- GET /profile
- GET /profile/enrolled-courses

## Contributing

If you want to contribute:

1. Fork the repository  
2. Create a new branch  
3. Make your changes  
4. Submit a pull request  

## Contact

Shivam Prajapati  
Portfolio: https://shivamprjpt.netlify.app  
LinkedIn: https://www.linkedin.com/in/shivam-prajapati-1073a4187  
