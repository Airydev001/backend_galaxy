const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const Kid = require('../models/Kid');

// Get all rewards
router.get('/', async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buy reward
router.post('/buy', async (req, res) => {
    const { kidId, rewardId } = req.body;

    try {
        const kid = await Kid.findById(kidId);
        const reward = await Reward.findById(rewardId);

        if (!kid || !reward) {
            return res.status(404).json({ message: 'Kid or Reward not found' });
        }

        if (kid.stars < reward.price) {
            return res.status(400).json({ message: 'Not enough stars' });
        }

        if (kid.inventory.includes(rewardId)) {
            return res.status(400).json({ message: 'Reward already owned' });
        }

        kid.stars -= reward.price;
        kid.inventory.push(rewardId);
        await kid.save();

        res.json({ message: 'Reward purchased successfully', stars: kid.stars, inventory: kid.inventory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
