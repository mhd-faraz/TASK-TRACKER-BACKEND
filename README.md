# Task Tracker Backend 🚀

A robust backend system for a task tracking and management application that facilitates collaboration and organization within teams or projects.

## 🔗 Links
- **GitHub Repo:** https://github.com/mhd-faraz/TASK-TRACKER-BACKEND
- **GitHub PR:** https://github.com/mhd-faraz/TASK-TRACKER-BACKEND/pull/1

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | File/image storage |
| Multer | File upload handling |
| Helmet | Security headers |
| Morgan | HTTP request logger |
| CORS | Cross-origin resource sharing |

---

## 📁 Project Structure

task-tracker-backend/
├── src/
│ ├── config/
│ │ ├── db.js
│ │ └── cloudinary.js
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── user.controller.js
│ │ ├── task.controller.js
│ │ ├── team.controller.js
│ │ └── comment.controller.js
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ ├── error.middleware.js
│ │ └── upload.middleware.js
│ ├── models/
│ │ ├── User.model.js
│ │ ├── Task.model.js
│ │ ├── Team.model.js
│ │ └── Comment.model.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── user.routes.js
│ │ ├── task.routes.js
│ │ ├── team.routes.js
│ │ └── comment.routes.js
│ ├── utils/
│ │ ├── ApiError.js
│ │ ├── ApiResponse.js
│ │ └── asyncHandler.js
│ └── app.js
├── .env.example
├── .gitignore
├── package.json
└── server.js


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/mhd-faraz/TASK-TRACKER-BACKEND.git
cd TASK-TRACKER-BACKEND
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

Fill in your `.env` file:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=*
NODE_ENV=development
```

### 4. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### 👤 User Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users` | Get all users | Private |
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update profile | Private |
| PUT | `/api/users/avatar` | Update avatar | Private |
| PUT | `/api/users/password` | Update password | Private |

### ✅ Task Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/tasks` | Create task | Private |
| GET | `/api/tasks` | Get all tasks | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| PATCH | `/api/tasks/:id/complete` | Mark complete | Private |

### 👥 Team Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/teams` | Create team | Private |
| GET | `/api/teams` | Get my teams | Private |
| GET | `/api/teams/:id` | Get single team | Private |
| POST | `/api/teams/join` | Join team | Private |
| PUT | `/api/teams/:id` | Update team | Private |
| DELETE | `/api/teams/:id/members/:userId` | Remove member | Private |

### 💬 Comment Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/tasks/:taskId/comments` | Add comment | Private |
| GET | `/api/tasks/:taskId/comments` | Get comments | Private |
| PUT | `/api/tasks/:taskId/comments/:commentId` | Update comment | Private |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | Delete comment | Private |

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

Include the token in the request header:

Authorization: Bearer your_jwt_token


---

## 📊 Data Models

### User
```json
{
  "name": "Mohammad Faraz",
  "email": "rfaraz5678@gmail.com",
  "password": "hashed_password",
  "avatar": "cloudinary_url",
  "bio": "Full Stack Developer"
}
```

### Task
```json
{
  "title": "Build REST API",
  "description": "Build a complete REST API",
  "status": "todo | in-progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "dueDate": "2024-12-31",
  "assignedTo": "user_id",
  "team": "team_id"
}
```

### Team
```json
{
  "name": "Dev Team",
  "description": "Development team",
  "owner": "user_id",
  "members": [{ "user": "user_id", "role": "admin | member" }],
  "inviteCode": "ABC12345"
}
```

### Comment
```json
{
  "content": "This task is done",
  "task": "task_id",
  "author": "user_id",
  "attachments": []
}
```

---

## 👨‍💻 Author

**Mohammad Faraz**
- GitHub: [@mhd-faraz](https://github.com/mhd-faraz)
- LinkedIn: [Mohammad Faraz](https://linkedin.com/in/mohammad-faraz-a27176223)
- Email: rfaraz5678@gmail.com

---

## 📄 License

This project is licensed under the ISC License.