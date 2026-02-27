const Error = require('../models/Error');

// Report an error
exports.reportError = async (req, res) => {
    try {
        const errorData = {
            error_type: req.body.error_type,
            message: req.body.message,
            details: req.body.details || {},
            job_id: req.body.job_id,
            service: req.body.service || req.service || 'unknown',
            timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date()
        };

        const error = new Error(errorData);
        await error.save();

        // Log error to console for debugging
        console.error('[Error Report]', {
            type: errorData.error_type,
            message: errorData.message,
            job_id: errorData.job_id,
            service: errorData.service
        });

        res.status(200).send();
    } catch (error) {
        console.error('Failed to save error report:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get all errors (bonus endpoint for debugging)
exports.getErrors = async (req, res) => {
    try {
        const { job_id, resolved, limit = 50 } = req.query;

        const query = {};
        if (job_id) query.job_id = job_id;
        if (resolved !== undefined) query.resolved = resolved === 'true';

        const errors = await Error.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.status(200).json(errors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
