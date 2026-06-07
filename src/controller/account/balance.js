import Account from "../../models/account.js"

const getBalance = async(req, res) => {
    try {
        const account = await Account.findOne({
        userId: req.userId
    })

    return res.status(200).json({
        message: "Balance fetched successfully",
        balance: account.balance
    })
    } 
    
    catch (error) {
        return res.status(500).json({
            message: "Error while fetching the account balance"
        })
    }
}

export default getBalance