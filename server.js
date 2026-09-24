require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║     Buddy Service API Server          ║
╠═══════════════════════════════════════╣
║  Server running on port: ${PORT}       ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  API Docs: http://localhost:${PORT}    ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
