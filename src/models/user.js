import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    }
})

const User = mongoose.model("User", userSchema)

export default User;