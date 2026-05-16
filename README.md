# Team Task Manager

A modern, full-stack Task Management application built with React, Tailwind CSS, Node.js, Express, and MySQL.

## Features

- **User Authentication**: Secure Signup & Login using JWT. Users can specify their specific Job Titles during registration.
- **Role-based Access**: Two primary roles—Admin and Member.
- **Interactive Dashboard**: A dynamic, public-facing dashboard providing quick overviews of Pending, In Progress, and Completed tasks.
- **Project Management**: Admins can easily create, edit, and delete projects.
- **Task Tracking**: Admins can assign tasks to specific users. All users can update the status of tasks.
- **User Directory**: A dedicated User Management page for Admins to view team members, complete with automatically generated profile avatars and role-based badges.
- **Modern UI/UX**: Clean, responsive interface powered by Tailwind CSS, featuring subtle micro-animations, custom toast notifications, and safety confirmation modals for destructive actions.

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MySQL2, bcryptjs, jsonwebtoken

## Local Setup

### Database Setup
1. Ensure MySQL is running on your system.
2. Run the `backend/db.sql` script in your MySQL instance to create the `team_Taskmanager` database and its required tables.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with your local database credentials and a secret key for JWT:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=team_Taskmanager
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *The backend will run on port 5000.*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on port 5173.*

## Deployment to Railway
1. Create a MySQL database instance in Railway and obtain your connection credentials.
2. Link your GitHub repository to Railway.
3. Deploy the backend and frontend as two separate services:
   - **Backend Service**: Set the root directory to `backend`. Add the environment variables `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET` matching your Railway DB.
   - **Frontend Service**: Set the root directory to `frontend`. Update the `baseURL` in `src/api.js` to point to your live backend URL, and configure Railway to build using `npm run build` as a static site.
