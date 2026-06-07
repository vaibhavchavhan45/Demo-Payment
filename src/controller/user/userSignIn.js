import jwt from "jsonwebtoken"
import signInBody from "../../validation/userSignInValidator.js"
import User from "../../models/user.js"


const userSignIn =  async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET
    try {
        const { success } = signInBody.safeParse(req.body)

    if (!success) {
        return res.status(400).json({
            message: "Wrong inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET)

        return res.status(200).json({
            message: "Login Successful",
            token: token
        })
    }

    else{
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }
    }
    
    catch (error) {
        return res.status(401).json({
            message: "Error while Logging in",
            error: error.message
        })
    }
}

export default userSignIn