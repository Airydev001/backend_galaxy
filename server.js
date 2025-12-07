const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const kidRoutes = require('./routes/kidRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const parentRoutes = require('./routes/parentRoutes');
const missionRoutes = require('./routes/missionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(cors({
    origin: '*', // Allow frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/kid', kidRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1/mission', missionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/subject', subjectRoutes);

app.get('/', (req, res) => {
    res.send('Learning Adventure Galaxy Backend is running');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
