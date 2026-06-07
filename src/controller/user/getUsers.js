import User from "../../models/user.js"


const getUsers = async (req, res) => {
    const filter = req.query.filter || ""

    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ]
        })

        return res.status(200).json({
            filteredUsers: users.map((item) => ({
                username: item.username,
                firstName: item.firstName,
                lastName: item.lastName,
                _id: item._id
            }))
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Error while fetching the users"
        })
    }
}

export default getUsers;