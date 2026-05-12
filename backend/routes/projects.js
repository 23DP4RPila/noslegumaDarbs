import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [projects] = await conn.query('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    await conn.release();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', verifyToken, [
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, description } = req.body;
    const conn = await pool.getConnection();
    
    await conn.query(
      'INSERT INTO projects (user_id, name, description, created_at) VALUES (?, ?, ?, NOW())',
      [req.userId, name, description || '']
    );
    
    await conn.release();
    res.status(201).json({ message: 'Project created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?',
      [name, description, id, req.userId]
    );
    
    await conn.release();
    res.json({ message: 'Project updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    
    await conn.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [id, req.userId]);
    
    await conn.release();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
