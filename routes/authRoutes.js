const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');

// Register Parent
router.post('/register', async (req, res) => {
    const { email, password, pin } = req.body;

    try {
        const parentExists = await Parent.findOne({ email });
        if (parentExists) {
            return res.status(400).json({ message: 'Parent already exists' });
        }

        const parent = await Parent.create({
            email,
            password, // In production, hash this password!
            pin,
        });

        if (parent) {
            res.status(201).json({
                _id: parent._id,
                email: parent.email,
                pin: parent.pin,
            });
        } else {
            res.status(400).json({ message: 'Invalid parent data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Parent
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const parent = await Parent.findOne({ email });

        if (parent && parent.password === password) { // In production, bcrypt.compare
            res.json({
                _id: parent._id,
                email: parent.email,
                pin: parent.pin,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
    const { parentId, pin } = req.body;

    try {
        const parent = await Parent.findById(parentId);

        if (parent && parent.pin === pin) {
            res.json({
                _id: parent._id,
                email: parent.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid PIN or Parent ID' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update PIN
router.put('/update-pin', async (req, res) => {
    const { parentId, newPin } = req.body;

    try {
        const parent = await Parent.findById(parentId);

        if (parent) {
            parent.pin = newPin;
            await parent.save();
            res.json({ message: 'PIN updated successfully' });
        } else {
            res.status(404).json({ message: 'Parent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
