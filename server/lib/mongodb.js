import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    try {
        let conn = await mongoose.connect(MONGODB_URI)
        return conn;
    } catch (err) {
        console.error("MongoDB Connection Error: ", err);
    }
}

export default connectToDatabase;
