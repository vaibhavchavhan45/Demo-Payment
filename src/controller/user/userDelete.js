import User from "../../models/user.js"


const deleteUser = async (req, res) => {
    const userId = req.userId

    try {
        await User.deleteOne({
            _id: userId
        })

        return res.status(200).json({
            message: "User deleted successfully"
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Error while deleting the user"
        })
    }
}

export default deleteUser