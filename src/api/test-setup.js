import { beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const getDbStatus = () => mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
    throw new Error('MongoDB URI is not defined in environment variables');
}

beforeAll(async () => {
    try {
        await mongoose.connect(dbUri);
        console.log('Test database connected to:', dbUri);
        // Wait for connection to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await mongoose.connection.close();
        console.log('Test database connection closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
});
