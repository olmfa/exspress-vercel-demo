const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB підключено');
    } catch (err) {
        console.error('❌ Помилка підключення до MongoDB:', err.message);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error(' Помилка MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(' MongoDB відключено');
    });
}

module.exports = connectDB;
