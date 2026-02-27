const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');
const authMiddleware = require('../middleware/auth');

// Apply authentication to all error routes
router.use(authMiddleware);

// Report an error
router.post('/report', errorController.reportError);

// Get errors (bonus endpoint for debugging)
router.get('/', errorController.getErrors);

module.exports = router;
