import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./src/db/db.js"
import mainRouter from "./src/routes/routes.js"

dotenv.config()


const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

connectDB()


app.use('/api/v1', mainRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
})