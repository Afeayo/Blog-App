const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/blog', {
            serverSelectionTimeoutMS: 5000, // Timeout in milliseconds for server selection
            socketTimeoutMS: 45000, // Timeout in milliseconds for socket operations
            connectTimeoutMS: 10000 // Timeout in milliseconds for initial connection
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit the process with an error code
    }
};

module.exports = connectDB;
