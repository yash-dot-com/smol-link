import express from "express"
import dotenv from "dotenv"
import {db} from "./db.js"
import { usersTable } from "./schema/user.schema.js"
import { eq} from "drizzle-orm"
import bcrypt from "bcrypt"
import {createToken, authMiddleware} from "./middlewares.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
app.use(cookieParser())
const PORT = process.env.PORT || 3000
app.use(express.json())

app.get("/health", async (req,res)=>{
    return res.status(200).json({
        health: "OK",
        code: 200
    })
})

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

// testing middleware 
app.get("/me", authMiddleware, (req, res) => {
  res.json({
    userId: req.userId
  })
})

app.post("/urls", (req, res) => {
  
})

app.get("/urls", (req, res) => {
  
})

app.delete("/urls/:id", (req, res) => {
  
})

app.get("/:shortcode", (req, res) => {
  
})



app.listen(PORT, ()=>{
    console.log("server running on port ", PORT)
})