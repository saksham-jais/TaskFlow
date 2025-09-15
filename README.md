# TaskFlow
TaskFlow is a full-stack task management application that allows users to create, view, and manage tasks. It features user authentication, weekly calendar-based task filtering, task progress tracking, and a responsive UI for a smooth user experience across devices.

---
## Table of Contents
- [TaskFlow Frontend](#taskflow-frontend)
- [TaskFlow Backend](#taskflow-backend)
- [Setup](#setup)
- [Contributing](#contributing)
- [License](#license)

---
## TaskFlow Frontend
The frontend is built with React and Tailwind CSS. It provides an intuitive and responsive interface for users to manage their tasks.

### Features
- Login and Signup forms
- Weekly calendar task filtering
- Task list management with add and completion toggle
- Task progress visualization
- Responsive design for mobile and desktop

### Tech Stack
- React
- Tailwind CSS
- Vite build tool

### Setup
1. Navigate to the frontend directory:
   ```bash
   cd taskflow-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with the following variable:
   ```env
   VITE_API_BASE_URL=https://your-backend-url/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. For production build:
   ```bash
   npm run build
   ```

---
## TaskFlow Backend
The backend provides RESTful APIs for user authentication and task management. It uses MongoDB with Mongoose for data storage and JWT for secure authentication.

### Features
- User signup and login with password hashing
- JWT-based authentication middleware
- Task CRUD operations secured per user
- MongoDB Atlas cloud connection support

### Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- dotenv for environment configurations

### Setup
1. Navigate to the backend directory:
   ```bash
   cd taskflow-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

---
## Setup (Full Project)
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Setup backend:
   ```bash
   cd taskflow-backend
   npm install
   # Add .env and run
   npm start
   ```
3. Setup frontend:
   ```bash
   cd ../taskflow-frontend
   npm install
   # Add .env and run
   npm run dev
   ```

---
## Contributing
Contributions are welcome! Please fork the repository and submit pull requests for improvements or bug fixes. Make sure to follow the project coding style and include tests as necessary.

---
## License
This project is licensed under the MIT License.
