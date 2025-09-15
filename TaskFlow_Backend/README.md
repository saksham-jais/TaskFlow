# TaskFlow Backend
This Node.js backend handles API operations for TaskFlow, including user authentication and task management.

## Features
- User sign up and login with password hashing
- Token-based secure authentication (JWT)
- Task CRUD APIs
- MongoDB Atlas integration with Mongoose ODM

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables
- `PORT` – Server listen port (default 5000)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – JWT signing secret key

## License
MIT License
