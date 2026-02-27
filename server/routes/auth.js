const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin & get token
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //  Check if admin exists
        const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        //  Compare entered password with hashed password in DB
        
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        //  Create JWT Payload
        const payload = {
            admin: {
                id: admin.id,
                username: admin.username
            }
        };

        //  Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' }, // Token expires in 8 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;