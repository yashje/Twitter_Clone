import express from "express"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import notifications from "./routes/notification.route.js"
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary"

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notifications", notifications);

app.listen(PORT, () => {
    console.log(`port is running on port ${PORT}`);
    connectMongoDB();
})
