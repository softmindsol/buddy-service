const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
    error_type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    job_id: {
        type: String
    },
    service: {
        type: String,
        default: 'unknown'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
errorSchema.index({ timestamp: -1 });
errorSchema.index({ job_id: 1 });
errorSchema.index({ resolved: 1 });

module.exports = mongoose.model('Error', errorSchema);
