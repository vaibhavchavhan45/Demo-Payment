import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import transferMoney from "../controller/account/transfer.js";
import getBalance from "../controller/account/balance.js"

const router = express.Router()

router.get('/balance', authMiddleware, getBalance)
router.post('/transfer', authMiddleware, transferMoney)

export default router