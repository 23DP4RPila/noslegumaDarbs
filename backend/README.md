# FocusFlow Backend - Node.js

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
- Create MySQL database
- Run `database/schema.sql` in your MySQL client:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=focusflow
PORT=5000
JWT_SECRET=your_super_secret_key
```

### 4. Run Server
**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/search/filter` - Filter tasks by status, priority, project

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project with tasks
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/tasks` - Get all tasks
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/history` - Task history log
- `DELETE /api/admin/users/:id` - Delete user

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Task","priority":"high","project_id":1}'
```

### Filter Tasks
```bash
curl "http://localhost:5000/api/tasks/search/filter?status=todo&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

- **users** - User accounts with roles (user/admin)
- **projects** - Project groupings for tasks
- **tasks** - Individual tasks with status tracking
- **work_sessions** - Track focus time on tasks
- **task_history** - Audit log of all task changes

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Admin role-based access control
