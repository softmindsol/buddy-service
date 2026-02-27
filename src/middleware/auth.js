const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const service = req.headers['x-service'];

    // Check if API key exists
    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    // Verify API key
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    // Optionally log the service making the request
    if (service) {
        req.service = service;
    }

    next();
};

module.exports = authMiddleware;
