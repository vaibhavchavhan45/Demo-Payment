import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import userSignUp from "../controller/user/userSignUp.js"
import userSignIn from "../controller/user/userSignIn.js"
import updateUser from "../controller/user/userUpdate.js"
import getUsers from "../controller/user/getUsers.js"
import deleteUser from "../controller/user/userDelete.js"


const router = express.Router()

router.use('/signup', userSignUp)
router.use('/signin', userSignIn)
router.use('/update', authMiddleware, updateUser)
router.use('/delete', authMiddleware, deleteUser)
router.use('/bulk', getUsers)

export default router