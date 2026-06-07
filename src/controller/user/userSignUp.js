import jwt from "jsonwebtoken"
import authMiddleware from "../../middleware/authMiddleware.js"
import signupBody from "../../validation/userSignUpValidator.js";
import User from "../../models/user.js"
import Account from "../../models/account.js"


const userSignUp = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET
    
    const userBody = req.body
    const parsedUserBody = signupBody.safeParse(userBody)

    if (!parsedUserBody.success) {
        return res.status(400).json({
            message: "Wrong inputs"
        })
    }

    const existingUser = await User.findOne({
        username: userBody.username
    })

    if (existingUser) {
        return res.status(409).json({
            message: "User with this email already Exists"
        })
    }

    const user = await User.create({
        username: userBody.username,
        password: userBody.password,
        firstName: userBody.firstName,
        lastName: userBody.lastName
    })

    const userId = user._id

    await Account.create({
        userId,
        balance: Math.floor(1 + Math.random() * 10000)
    })

    const token = jwt.sign({ userId }, JWT_SECRET)
    //OR const token = jwt.sign({userId: userId}, JWT_SECRET)
    //jwt.sign(payload, secret) here, payload must be an object

    return res.status(201).json({
        message: "User Created successfully",
        token: token
    })
}

export default userSignUp
