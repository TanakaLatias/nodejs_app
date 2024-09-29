import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri: string = process.env.URI || 'dummy-uri';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
};