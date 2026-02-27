const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth'); 

/**
 * @route   POST /api/admin/notes/:id
 * @desc    Add a follow-up note to a lead
 * @access  Private (Admin only)
 */
// backend/routes/notes.js
router.post('/:id', auth, async (req, res) => {
    const { content } = req.body;
    const leadId = req.params.id;
    const adminId = req.admin.id; // Correctly pulling from the auth middleware 

    try {
        await pool.query(
            'INSERT INTO lead_notes (lead_id, admin_id, note_text) VALUES (?, ?, ?)',
            [leadId, adminId, content]
        );
        res.status(201).json({ message: "Note logged successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/admin/leads/:id/notes
 * @desc    Get all notes for a specific lead with Admin names
 * @access  Private (Admin only)
 */
router.get('/:id', auth, async (req, res) => {
    const leadId = req.params.id;

    try {
        //  to get the username of the admin who wrote the note
        const sql = `
            SELECT n.*, a.username as admin_name 
            FROM lead_notes n 
            JOIN admins a ON n.admin_id = a.id 
            WHERE n.lead_id = ? 
            ORDER BY n.created_at DESC`;
            
        const [rows] = await pool.query(sql, [leadId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

module.exports = router;