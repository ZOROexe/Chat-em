import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log(`Mongo Db connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`mongodb connection failed ${error}`);
    }
}