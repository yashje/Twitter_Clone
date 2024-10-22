import mongoose from "mongoose"

const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.error(`Error connection to mongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;