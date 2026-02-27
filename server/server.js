const express = require('express');
const cors = require('cors');
require('dotenv').config();
const leadRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();

// 1. MIDDLEWARE 
app.use(cors());
app.use(express.json());

// 2. ROOT TEST (Check http://localhost:5000)
app.get('/', (req, res) => {
    res.send("Backend is alive and responding!");
});

// 3. HEALTH CHECK (Check http://localhost:5000/health)
app.get('/health', (req, res) => {
    res.json({ status: "Server is running smoothly!" });
});

// 4. MOUNT ROUTES
//  every route in leads.js will start with /api/leads
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/notes', notesRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CRM Server spinning on http://localhost:${PORT}`);
});