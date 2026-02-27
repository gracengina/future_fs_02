const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const auth=require('../middleware/auth.js');

/**
 * @route   POST /api/leads
 * @desc    Capture a new lead from a form
 */
router.post('/', async (req, res) => {
    const { name, email, phone, source } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO leads (name, email, phone, source) VALUES (?, ?, ?, ?)',
            [name, email, phone, source]
        );
        res.status(201).json({ leadId: result.insertId, message: "Lead saved!" });
    } catch (err) {
        console.error('POST /api/leads error:', err);
        
        // Handle duplicate email error gracefully
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "A lead with this email already exists" });
        }
        
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/leads
 * @desc    Fetch all leads with their total note count
 */
router.get('/', auth,async (req, res) => {
    try {
        
const sql = `
    SELECT l.*, 
    COUNT(n.id) as total_notes,
    MAX(n.created_at) as last_contact
    FROM leads l 
    LEFT JOIN lead_notes n ON l.id = n.lead_id 
    GROUP BY l.id 
    ORDER BY l.created_at DESC`;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

/**
 * @route   PATCH /api/leads/:id/status
 * @desc    Update lead status (New, Contacted, etc.)
 */
router.patch('/:id/status', auth,async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

module.exports = router;