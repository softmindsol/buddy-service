const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Basic product information
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },

    // Pricing information
    price: {
        type: Number,
        required: true
    },
    original_price: {
        type: Number
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    market_price_reference: {
        type: Number
    },
    recommended_price: {
        type: Number
    },
    pricing_rule_applied: {
        type: Boolean,
        default: false
    },

    // Availability and source
    availability: {
        type: Boolean,
        default: true
    },
    source_url: {
        type: String,
        required: true
    },
    source_platform: {
        type: String,
        required: true,
        enum: ['amazon', 'flipkart', 'noon', 'other'],
        lowercase: true
    },

    // Images (flexible array of objects)
    images: [{
        type: mongoose.Schema.Types.Mixed
    }],

    // Specifications (flexible nested object)
    specifications: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Variants (flexible array)
    variants: [{
        type: mongoose.Schema.Types.Mixed
    }],

    // Review and confidence data
    confidence: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    review_required: {
        type: Boolean,
        default: false
    },
    review_reasons: [{
        type: String
    }],

    // Unique fingerprint for deduplication
    fingerprint: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // Additional flexible fields for any extra data
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    // Allow additional fields not defined in schema
    strict: false
});

// Indexes for better performance
productSchema.index({ source_platform: 1, createdAt: -1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ availability: 1 });
productSchema.index({ confidence: 1 });

module.exports = mongoose.model('Product', productSchema);
