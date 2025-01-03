import mongoose from "mongoose";

export const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
        });
        
        console.info("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
}

export const closeMongoConnection = async (): Promise<void> => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    console.info("MongoDB connection closed");
}