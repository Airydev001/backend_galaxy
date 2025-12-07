const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    kidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kid',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['achievement', 'mission', 'system'],
        default: 'system',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
