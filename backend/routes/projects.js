const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a project (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to create projects' });
        }

        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const [result] = await db.query(
            'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
            [name, description, req.user.id]
        );

        res.status(201).json({ 
            message: 'Project created', 
            projectId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a project (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to edit projects' });
        }
        
        const projectId = req.params.id;
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        
        const [result] = await db.query(
            'UPDATE projects SET name = ?, description = ? WHERE id = ?',
            [name, description, projectId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a project (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete projects' });
        }
        
        const projectId = req.params.id;
        
        // Note: In a real app, you might want to check if there are tasks linked to this project first
        // or let the DB handle it with ON DELETE CASCADE if configured.
        
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
