const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    kidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kid',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    lessonId: {
        type: String, // Assuming lesson IDs are strings within the Subject document
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
