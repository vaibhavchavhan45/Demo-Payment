import jwt from "jsonwebtoken"


function authMiddleware(req, res, next){
    const JWT_SECRET = process.env.JWT_SECRET
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            message: "No token Provided"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if(decoded.userId){
            req.userId = decoded.userId
            next()
        }
        else{
            res.status(403).json({
                message: "Forbidden"
            })
        }
    } 
    
    catch (error) {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}

export default authMiddleware