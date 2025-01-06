import { MongoClient, ServerApiVersion } from 'mongodb';
import * as log4js from 'log4js';
import mongoose from 'mongoose';

const logger = log4js.getLogger("db");

export const getMongoClient = async (uri: string): Promise<typeof mongoose> => {
    try {
        const client = await mongoose.connect(uri);       
        logger.info("MongoDB connected")

        return client;
    } catch (error) {
        logger.error("MongoDB connection failed");
        logger.error(error);
        process.exit(1);
    }
}