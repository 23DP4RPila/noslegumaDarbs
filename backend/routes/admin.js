import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.query('SELECT id, email, name, role, created_at FROM users');
    await conn.release();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get system statistics
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    const [userCount] = await conn.query('SELECT COUNT(*) as count FROM users');
    const [taskCount] = await conn.query('SELECT COUNT(*) as count FROM tasks');
    const [completedCount] = await conn.query('SELECT COUNT(*) as count FROM tasks WHERE status = "completed"');
    
    await conn.release();
    
    res.json({
      totalUsers: userCount[0].count,
      totalTasks: taskCount[0].count,
      completedTasks: completedCount[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Delete user
router.delete('/users/:userId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const conn = await pool.getConnection();
    
    await conn.query('DELETE FROM tasks WHERE user_id = ?', [userId]);
    await conn.query('DELETE FROM projects WHERE user_id = ?', [userId]);
    await conn.query('DELETE FROM users WHERE id = ?', [userId]);
    
    await conn.release();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
