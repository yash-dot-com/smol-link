import express from "express"
import {db} from "../db.js"
import { usersTable } from "../schema/user.schema.js"
import { eq} from "drizzle-orm"
import bcrypt from "bcrypt"
import {createToken, authMiddleware} from "../middlewares.js"

const authRouter = express.Router()

// signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email
      })

    return res.status(201).json({
      message: "User created successfully",
      user: newUser
    })

  } catch (error) {
    console.error("Signup Error:", error)

    return res.status(500).json({
      message: "Internal server error"
    })
  }
})

// login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Email & Password both are required"
    })
  }
  
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
    if (!user) {
      return res.status(401).json({
        message: "invalid credentials"
      })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({
        message: "invalid credentials"
      })
    }

    // create and send JWT token and use it in cookie 
    const token = createToken(user.id)

    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })

    return res.status(200).json({
      message: "logged in successfully"
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "internal server error"
    })
  }
})

// logout
authRouter.post("/logout", authMiddleware, async (req, res) => {
  // check request has token as cookie, if not send error response -> done by authMiddleware
  // if token exists -> clear cookie from response 
  res.clearCookie("userToken")

  return res.status(200).json({
    message : "logged out successfully"
  })
})

export default authRouter;

// how cookie-Parser works 
// - without cookieparser req.headers.cookie
// - with cookieparser req.cookies  