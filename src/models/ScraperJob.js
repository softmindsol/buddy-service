const mongoose = require('mongoose');

const scraperJobSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    platform: {
        type: String,
        enum: ['amazon', 'flipkart', 'noon']
    },
    progress: {
        current: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        message: {
            type: String
        }
    },
    error: {
        type: String
    },
    started_at: {
        type: Date
    },
    completed_at: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ScraperJob', scraperJobSchema);
