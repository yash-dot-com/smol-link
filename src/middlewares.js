import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const SECRET = process.env.JWT_SECRET
if (!SECRET) {
  throw new Error("JWT_SECRET is missing")
}

// from userId
export function createToken(userId) {
  const token = jwt.sign({
    userId
  },
    SECRET,
    {
      expiresIn:"7d"
    }
  )
  return token
}

// verify token
export function authMiddleware(req, res, next) {
  try {
    // middleware read cookies
    const token = req.cookies.userToken
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
    console.log(token)
    // verify with jwt.verify 
    const decoded = jwt.verify(token, SECRET)
    // extract the token from decoded cookie 
    const userId = decoded.userId
    
    // attach userId to request object for authentication
    req.userId = decoded.userId
    // calls next function
    next()
    
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Expired token login again"
    })
  }
}