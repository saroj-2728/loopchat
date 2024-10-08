import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    let conn = await mongoose.connect(MONGODB_URI)
    return conn;
}

export default connectToDatabase;
