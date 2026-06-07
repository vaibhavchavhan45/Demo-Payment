import mongoose from "mongoose";


const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log("Error while connecting with the database", err.message))
}

export default connectDB;
    