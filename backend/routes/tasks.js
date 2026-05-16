const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all tasks (Can filter by project_id)
router.get('/', async (req, res) => {
    try {
        const projectId = req.query.project_id;
        let query = `
            SELECT tasks.*, projects.name as project_name, users.name as assigned_name 
            FROM tasks 
            LEFT JOIN projects ON tasks.project_id = projects.id
            LEFT JOIN users ON tasks.assigned_to = users.id
        `;
        let params = [];

        if (projectId) {
            query += ' WHERE tasks.project_id = ?';
            params.push(projectId);
        }

        const [tasks] = await db.query(query, params);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a task (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to create tasks' });
        }

        const { project_id, title, description, assigned_to, due_date } = req.body;
        
        if (!project_id || !title) {
            return res.status(400).json({ message: 'Project ID and title are required' });
        }

        const [result] = await db.query(
            'INSERT INTO tasks (project_id, title, description, assigned_to, due_date) VALUES (?, ?, ?, ?, ?)',
            [project_id, title, description, assigned_to || null, due_date || null]
        );

        res.status(201).json({ 
            message: 'Task created', 
            taskId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task status (Anyone assigned to it, or Admin)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const taskId = req.params.id;

        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const [result] = await db.query(
            'UPDATE tasks SET status = ? WHERE id = ?',
            [status, taskId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get users for assignment
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, job_title FROM users');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a task (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to edit tasks' });
        }
        
        const taskId = req.params.id;
        const { title, description, project_id, assigned_to, due_date } = req.body;
        
        if (!project_id || !title) {
            return res.status(400).json({ message: 'Project ID and title are required' });
        }
        
        const [result] = await db.query(
            'UPDATE tasks SET title = ?, description = ?, project_id = ?, assigned_to = ?, due_date = ? WHERE id = ?',
            [title, description, project_id, assigned_to || null, due_date || null, taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a task (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete tasks' });
        }
        
        const taskId = req.params.id;
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
