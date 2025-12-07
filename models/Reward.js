const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Avatar', 'Themes', 'Outfits'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
