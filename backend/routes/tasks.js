import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, priority, search, projectId } = req.query;
    const conn = await pool.getConnection();
    
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.userId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }
    if (projectId) {
      query += ' AND project_id = ?';
      params.push(projectId);
    }
    
    query += ' ORDER BY created_at DESC';
    const [tasks] = await conn.query(query, params);
    
    await conn.release();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', verifyToken, [
  body('title').notEmpty(),
  body('status').isIn(['todo', 'in_progress', 'completed', 'skipped'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { title, description, priority, status, projectId } = req.body;
    const conn = await pool.getConnection();
    
    await conn.query(
      'INSERT INTO tasks (user_id, title, description, priority, status, project_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [req.userId, title, description || '', priority || 'medium', status || 'todo', projectId || null]
    );
    
    await conn.release();
    res.status(201).json({ message: 'Task created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;
    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description, priority, status, id, req.userId]
    );
    
    await conn.release();
    res.json({ message: 'Task updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    
    await conn.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.userId]);
    
    await conn.release();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
