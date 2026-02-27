const ScraperJob = require('../models/ScraperJob');

// Update job status
exports.updateJobStatus = async (req, res) => {
    try {
        const { job_id } = req.params;
        const updateData = {
            ...req.body
        };

        // Set completed_at timestamp if status is completed or failed
        if (req.body.status === 'completed' || req.body.status === 'failed') {
            updateData.completed_at = new Date();
        }

        // Set started_at timestamp if status is in_progress and not already set
        if (req.body.status === 'in_progress') {
            const existingJob = await ScraperJob.findOne({ job_id });
            if (!existingJob || !existingJob.started_at) {
                updateData.started_at = new Date();
            }
        }

        const job = await ScraperJob.findOneAndUpdate(
            { job_id },
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get scraper configuration (mock implementation)
exports.getScraperConfig = async (req, res) => {
    try {
        const { platform } = req.query;

        // This is a mock configuration - customize as needed
        const config = {
            platforms: {
                amazon: {
                    enabled: true,
                    rate_limit: 1000,
                    selectors: {
                        price: '.a-price-whole',
                        title: '#productTitle',
                        rating: '.a-icon-star',
                        reviews: '#acrCustomerReviewText'
                    }
                },
                flipkart: {
                    enabled: true,
                    rate_limit: 800,
                    selectors: {
                        price: '._30jeq3',
                        title: '.B_NuCI',
                        rating: '._3LWZlK',
                        reviews: '._2_R_DZ'
                    }
                },
                noon: {
                    enabled: true,
                    rate_limit: 500,
                    selectors: {
                        price: '.price',
                        title: '.product-title',
                        rating: '.rating',
                        reviews: '.review-count'
                    }
                }
            },
            global_settings: {
                max_retries: 3,
                timeout: 30,
                user_agent: 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
                concurrent_requests: 5
            }
        };

        // Filter by platform if specified
        if (platform) {
            const platformConfig = config.platforms[platform];
            if (!platformConfig) {
                return res.status(404).json({ error: 'Platform not found' });
            }
            return res.status(200).json({
                platforms: { [platform]: platformConfig },
                global_settings: config.global_settings
            });
        }

        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
