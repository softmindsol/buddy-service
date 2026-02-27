const express = require('express');
const router = express.Router();
const scraperJobController = require('../controllers/scraperJobController');
const authMiddleware = require('../middleware/auth');

// Apply authentication to all scraper job routes
router.use(authMiddleware);

// Update job status
router.patch('/:job_id', scraperJobController.updateJobStatus);

// Get scraper configuration
router.get('/config', scraperJobController.getScraperConfig);

module.exports = router;
