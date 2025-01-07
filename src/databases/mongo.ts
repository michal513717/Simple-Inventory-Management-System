import * as log4js from 'log4js';
import mongoose from 'mongoose';

const logger = log4js.getLogger("Database");

export const getMongoClient = async (uri: string): Promise<typeof mongoose> => {
    try {
        const client = await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });       
        logger.info("MongoDB connected");

        return client;
    } catch (error) {
        logger.error("MongoDB connection failed");
        logger.error(error);
        process.exit(1);
    }
}