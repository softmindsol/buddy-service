const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const productRoutes = require('./routes/products');
const scraperJobRoutes = require('./routes/scraperJobs');
const errorRoutes = require('./routes/errors');
const healthRoutes = require('./routes/health');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Request logging middleware
app.use(morgan('combined'));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scraper-jobs', scraperJobRoutes);
app.use('/api/scraper-config', scraperJobRoutes); // Map /api/scraper-config to scraper jobs
app.use('/api/errors', errorRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Buddy Service API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            scraperJobs: '/api/scraper-jobs',
            scraperConfig: '/api/scraper-config',
            errors: '/api/errors'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

module.exports = app;
