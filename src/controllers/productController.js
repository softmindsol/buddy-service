const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        console.log('Console log Product creation:', req.body);

        const product = new Product(req.body);
        await product.save();

        res.status(201).json({
            id: product._id,
            message: 'Product created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Product with this fingerprint already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            id: product._id,
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Batch create/update products
exports.batchProducts = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        let created = 0;
        let updated = 0;
        let failed = 0;
        const product_ids = [];

        for (const productData of products) {
            try {
                // Check if product exists by fingerprint
                const existing = await Product.findOne({ fingerprint: productData.fingerprint });

                if (existing) {
                    await Product.findByIdAndUpdate(existing._id, productData);
                    product_ids.push(existing._id);
                    updated++;
                } else {
                    const newProduct = new Product(productData);
                    await newProduct.save();
                    product_ids.push(newProduct._id);
                    created++;
                }
            } catch (error) {
                console.error('Batch processing error:', error.message);
                failed++;
            }
        }

        res.status(200).json({
            created,
            updated,
            failed,
            product_ids
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check if product exists by fingerprint
exports.getProductByFingerprint = async (req, res) => {
    try {
        const product = await Product.findOne({ fingerprint: req.params.fingerprint });

        if (!product) {
            return res.status(404).send();
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
