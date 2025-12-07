const mongoose = require('mongoose');

const kidSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ageGroup: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        default: 0,
    },
    inventory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Kid', kidSchema);
