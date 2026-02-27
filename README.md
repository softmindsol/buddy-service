## 🗄️ Generic Product Model

The backend uses a **generic, flexible Product model** that can handle any product data structure from your scraper service. The model uses MongoDB's Mixed types for complex nested objects and arrays, making it adaptable to different product types and platforms.

### Supported Data Structure

The model can handle products like:

**Jewelry (Necklaces, Rings, etc.)**

```json
{
  "title": "FANCIME Birthstone Necklace...",
  "brand": "FANCIME",
  "specifications": {
    "metal_stamp": "925 Sterling Silver",
    "gem_type": "Opal",
    "setting": "Prong",
    "weight": { "raw": "3 cttw", "value": null, "unit": null }
  },
  "images": [{ "url": "...", "hash": "...", "width": 108, "height": 300 }]
}
```

**Electronics (Smartwatches, Phones, etc.)**

```json
{
  "title": "Amazfit Bip 6 Smart Watch...",
  "brand": "Amazfit",
  "specifications": {
    "operating_system": "Zepp OS",
    "connectivity": "Bluetooth",
    "resolution": { "raw": "390 x 450", "width": 390, "height": 450 },
    "ram": { "raw": "512 MB", "value_gb": 0.5 }
  },
  "images": [{ "url": "...", "original_url": "...", "is_primary": true }]
}
```

### Key Features

- **Flexible Schema**: Uses `mongoose.Schema.Types.Mixed` for specifications, images, and variants
- **Deduplication**: Unique fingerprint prevents duplicate products
- **Rich Metadata**: Supports confidence scores, review requirements, pricing rules
- **Multi-Platform**: Works with Amazon, Flipkart, Noon, and other platforms
- **Extensible**: Add any custom fields without schema changes

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buddy-service
API_KEY=your-secure-api-key-here
NODE_ENV=development
```

3. **Start the server:**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

All endpoints (except health check) require authentication:

- Header: `X-API-Key: your-api-key-here`
- Header: `X-Service: scraper-service`

### Health Check

- `GET /api/health` - Check server status (no auth required)

### Products

- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `POST /api/products/batch` - Batch create/update products
- `GET /api/products/by-fingerprint/:fingerprint` - Check if product exists

### Scraper Jobs

- `PATCH /api/scraper-jobs/:job_id` - Update job status
- `GET /api/scraper-config` - Get scraper configuration
- `GET /api/scraper-config?platform=amazon` - Get platform-specific config

### Errors

- `POST /api/errors/report` - Report an error
- `GET /api/errors` - Get all errors (with optional filters)

## 📁 Project Structure

```
buddy-service/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── scraperJobController.js
│   │   └── errorController.js
│   ├── middleware/
│   │   └── auth.js              # API key authentication
│   ├── models/
│   │   ├── Product.js
│   │   ├── ScraperJob.js
│   │   └── Error.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── scraperJobs.js
│   │   ├── errors.js
│   │   └── health.js
│   └── app.js                   # Express app configuration
├── server.js                    # Server entry point
├── package.json
└── .env
```

## 🧪 Testing with cURL

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-here" \
  -H "X-Service: scraper-service" \
  -d '{
    "title": "Test Product",
    "price": 99.99,
    "currency": "USD",
    "platform": "amazon",
    "url": "https://example.com/product",
    "images": ["https://example.com/image.jpg"],
    "fingerprint": "unique-test-hash-123",
    "scraped_at": "2024-01-01T12:00:00Z"
  }'
```

### Update Job Status

```bash
curl -X PATCH http://localhost:5000/api/scraper-jobs/job-123 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-here" \
  -H "X-Service: scraper-service" \
  -d '{
    "status": "completed",
    "progress": {
      "current": 100,
      "total": 100,
      "message": "All items processed"
    }
  }'
```

### Report Error

```bash
curl -X POST http://localhost:5000/api/errors/report \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-here" \
  -H "X-Service: scraper-service" \
  -d '{
    "error_type": "scraping_error",
    "message": "Failed to scrape product",
    "details": {
      "url": "https://example.com",
      "platform": "amazon"
    },
    "job_id": "job-123"
  }'
```

## 🔒 Security

- API key authentication on all endpoints (except health check)
- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Input validation using Mongoose schemas

## 🛠 Development

The codebase is organized for easy maintenance:

- **Controllers** handle business logic
- **Models** define data schemas
- **Routes** define API endpoints
- **Middleware** handles cross-cutting concerns

## 📝 Notes

- Products are deduplicated using fingerprints
- Jobs are created/updated automatically using upsert
- All timestamps are in ISO 8601 format
- The scraper config endpoint returns mock data (customize as needed)

## 🤝 Contributing

Feel free to customize this service for your specific needs. The code is designed to be clean and easy to modify.
