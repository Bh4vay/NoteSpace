# NoteSpace

A simple Notes application built with the MERN stack (MongoDB, Express, React, Node.js). This app allows users to sign up, log in, and manage notes with features such as creating, updating, deleting, and pinning notes.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## Features

- User Authentication (Sign up, Login)
- CRUD Operations (Create, Read, Update, Delete Notes)
- Pin/Unpin Notes for easy access
- Responsive Design for desktop and mobile
- Secure Passwords with encryption (using bcrypt)
- Session-based or JWT-based authentication

## Demo

- [Link]([https://nodejs.org/](https://note-space-frontend.vercel.app/))

## Tech Stack

**Frontend:** React, Axios, Tailwind CSS / Bootstrap (or other UI library)

**Backend:** Node.js, Express

**Database:** MongoDB

**Authentication:** JWT (JSON Web Tokens)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud database like MongoDB Atlas)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies for both frontend and backend:**

    - Install backend dependencies:

      ```bash
      cd backend
      npm install
      ```

    - Install frontend dependencies:

      ```bash
      cd ../frontend
      npm install
      ```

3. **Set up Environment Variables:**

   Create an `.env` file in the backend directory with the following variables:

   ```env
   MONGODB_URI=<Your MongoDB Connection String>
   JWT_SECRET=<Your JWT Secret Key>
   Port = <Enter the port for server>

4. **Run the Application:**
   - Start the backend server::

      ```bash
      cd backend
      npm start
      ```
    - Start the backend server::

      ```bash
      cd ../frontend
      npm run dev
      ```
