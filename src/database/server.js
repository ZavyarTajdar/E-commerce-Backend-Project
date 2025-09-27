import mongoose from "mongoose";
import { DB_NAME } from '../constant.js'

const connectDB = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
        console.log(`📍 Host: ${ConnectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1)
    }
}

export default connectDB;