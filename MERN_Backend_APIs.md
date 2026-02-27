# MERN Backend APIs for Scraper Service Integration

This document outlines the API endpoints required in the MERN backend to integrate with the scraper service. The scraper service sends scraped product data, updates job statuses, and reports errors to the backend.

## Authentication

All API requests require authentication using an API key in the `X-API-Key` header. The scraper service identifies itself with the `X-Service: scraper-service` header.

```
X-API-Key: your-api-key-here
X-Service: scraper-service
Content-Type: application/json
```

## Base URL

All endpoints are relative to the MERN backend base URL configured in the scraper service settings.

## Endpoints

### 1. Create Product

**Endpoint:** `POST /api/products`

Creates a new product in the database.

**Request Body:**

```json
{
  "title": "Product Title",
  "price": 99.99,
  "original_price": 129.99,
  "currency": "USD",
  "brand": "Brand Name",
  "platform": "amazon",
  "url": "https://example.com/product",
  "images": ["https://example.com/image1.jpg"],
  "rating": 4.5,
  "review_count": 1234,
  "availability": "in_stock",
  "specifications": { "key": "value" },
  "variants": [{ "name": "Size", "value": "Large" }],
  "fingerprint": "unique-fingerprint-hash",
  "scraped_at": "2024-01-01T12:00:00Z",
  "ai_rewritten_title": "AI Rewritten Title",
  "ai_description": "AI Generated Description"
}
```

**Response (Success - 201):**

```json
{
  "id": "product-id",
  "message": "Product created successfully"
}
```

**Response (Error - 400/500):**

```json
{
  "error": "Error message"
}
```

### 2. Update Product

**Endpoint:** `PUT /api/products/{id}`

Updates an existing product.

**Request Body:** Same as create product, but includes the product ID in the URL.

**Response:** Same as create product.

### 3. Batch Create/Update Products

**Endpoint:** `POST /api/products/batch`

Creates or updates multiple products in a single request.

**Request Body:**

```json
{
  "products": [
    {
      "title": "Product 1"
      // ... product fields
    },
    {
      "title": "Product 2"
      // ... product fields
    }
  ]
}
```

**Response (Success - 200):**

```json
{
  "created": 1,
  "updated": 1,
  "failed": 0,
  "product_ids": ["id1", "id2"]
}
```

### 4. Check Product Exists

**Endpoint:** `GET /api/products/by-fingerprint/{fingerprint}`

Checks if a product with the given fingerprint already exists.

**Response (Exists - 200):**

```json
{
  "id": "existing-product-id",
  "title": "Existing Product"
  // ... other product fields
}
```

**Response (Not Found - 404):** Empty body

### 5. Update Job Status

**Endpoint:** `PATCH /api/scraper-jobs/{job_id}`

Updates the status of a scraping job.

**Request Body:**

```json
{
  "status": "completed",
  "updated_at": "2024-01-01T12:00:00Z",
  "progress": {
    "current": 50,
    "total": 100,
    "message": "Processing items..."
  },
  "error": "Error message (optional)"
}
```

**Response (Success - 200):** Empty body

### 6. Get Scraping Configuration

**Endpoint:** `GET /api/scraper-config`

Retrieves scraping configuration, optionally filtered by platform.

**Query Parameters:**

- `platform` (optional): Filter by platform (e.g., "amazon", "flipkart")

**Response (Success - 200):**

```json
{
  "platforms": {
    "amazon": {
      "enabled": true,
      "rate_limit": 1000,
      "selectors": {
        "price": ".price-selector"
      }
    }
  },
  "global_settings": {
    "max_retries": 3,
    "timeout": 30
  }
}
```

### 7. Report Error

**Endpoint:** `POST /api/errors/report`

Sends error reports for monitoring and debugging.

**Request Body:**

```json
{
  "error_type": "scraping_error",
  "message": "Failed to scrape product",
  "details": {
    "url": "https://example.com",
    "platform": "amazon",
    "error_code": 500
  },
  "job_id": "job-123",
  "service": "scraper-service",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response (Success - 200):** Empty body

### 8. Health Check

**Endpoint:** `GET /api/health`

Checks if the backend is healthy and reachable.

**Response (Healthy - 200):**

```json
{
  "status": "healthy",
  "service": "mern-backend"
}
```

**Response (Unhealthy - 500):** Error details

## Product Data Schema

The product data sent by the scraper includes the following fields:

- `title` (string): Product title
- `price` (number): Current price
- `original_price` (number, optional): Original price before discount
- `currency` (string): Currency code (e.g., "USD", "INR")
- `brand` (string, optional): Product brand
- `platform` (string): Source platform ("amazon", "flipkart", "noon")
- `url` (string): Product URL
- `images` (array of strings): Image URLs
- `rating` (number, optional): Average rating
- `review_count` (number, optional): Number of reviews
- `availability` (string): Stock status ("in_stock", "out_of_stock", "limited")
- `specifications` (object): Product specifications as key-value pairs
- `variants` (array of objects): Product variants with name/value
- `fingerprint` (string): Unique hash for deduplication
- `scraped_at` (string): ISO timestamp of scraping
- `ai_rewritten_title` (string, optional): AI-processed title
- `ai_description` (string, optional): AI-generated description

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200/201`: Success
- `400`: Bad request (invalid data)
- `401`: Unauthorized (invalid API key)
- `404`: Not found
- `409`: Conflict (duplicate data)
- `500`: Internal server error

Error responses should include a JSON body with an `error` field describing the issue.

## Implementation Notes

- All endpoints should be asynchronous to handle concurrent requests from multiple scraper instances.
- Store product fingerprints for efficient deduplication lookups.
- Implement proper logging for all API calls for debugging.
- Consider implementing webhooks or real-time updates for job status changes if needed by the frontend.
