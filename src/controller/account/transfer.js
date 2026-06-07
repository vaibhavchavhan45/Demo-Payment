import mongoose from "mongoose"
import Account from "../../models/account.js"


const transferMoney = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {amount, to} = req.body

        const senderAccount = await Account.findOne({
            userId: req.userId
        }).session(session)

        if(!senderAccount || !senderAccount.balance || senderAccount.balance < amount || senderAccount.balance < 0){
            await session.abortTransaction()
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }

        const receiverAccount = await Account.findOne({
            userId: to
        }).session(session)

        if(!receiverAccount){
            await session.abortTransaction()
            return res.status(404).json({
                message: "Receiver doesn't exist"
            })
        }

        await Account.updateOne(
            {userId: req.userId},
            {$inc:{ balance: -amount}}
        ).session(session)

        await Account.updateOne(
            {userId: to},
            {$inc: {balance: amount}}
        ).session(session)

        await session.commitTransaction()

        return res.status(200).json({
            message: "Money transfer successful"
        })
    } 
    
    catch (error) {
        await session.abortTransaction()
        res.status(500).json({
            message: "Money transfer failed"
        })
    }

    finally{
        await session.endSession()
    }
}

export default transferMoney