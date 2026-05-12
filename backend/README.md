# FocusFlow Backend

Node.js Express backend for task management application with work mode focus feature.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MySQL 5.7+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup database:**
```bash
mysql -u root -p < database/schema.sql
```

3. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=focusflow
JWT_SECRET=your_super_secret_key
```

4. **Start development server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

Query params: `?status=todo&priority=high&search=query&projectId=1`

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/stats` - System statistics (admin only)
- `DELETE /api/admin/users/:userId` - Delete user

## 🔐 Authentication

All protected endpoints require Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

- **users** - User accounts with roles
- **projects** - User projects (grouping)
- **tasks** - Individual tasks with status
- **work_sessions** - Track focus periods
- **task_history** - Audit log
- **user_statistics** - User stats and streaks

## 🛡️ Security

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS protection
- Helmet.js security headers

## 📝 Development

```bash
npm run dev      # Start with nodemon
npm start        # Start production
```
