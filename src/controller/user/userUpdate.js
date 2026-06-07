import jwt from "jsonwebtoken"
import updateBody from "../../validation/userUpdateValidator.js"
import User from "../../models/user.js"


const updateUser = async (req, res) => {
    const { success } = updateBody.safeParse(req.body)

    if (!success) {
        return res.status(400).json({
            message: "Wrong input data"
        })
    }

    try {
        await User.updateOne(
            { _id: req.userId },
            req.body
        )

        return res.status(200).json({
            message: "User updated successfully"
        })
    }
    catch (err) {
        return res.status(401).json({
            message: "Error while updating the user"
        })
    }
}

export default updateUser