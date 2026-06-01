import express from "express"
import dotenv from "dotenv"
import {db} from "./db.js"
import { usersTable } from "./schema/user.schema.js"
import { eq, sql } from "drizzle-orm"
import bcrypt from "bcrypt"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.get("/health", async (req,res)=>{
    return res.status(200).json({
        health: "OK",
        code: 200
    })
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  try {
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
    if (existingUser.length) {
      return res.status(409).json({
        message: "user already exists"
      })
    }
  } catch (error) {
    console.log("ERROR checking whether user already exists or not", error.message)
    return res.status(500).json({
      message: "Internal server error"+ error.message
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  try {
    const [newUser] = await db.insert(usersTable).values({
      email,
      password: hash
    }).returning()

    return res.status(201).json({
      message: "user created successfully",
      id: newUser.id,
      email: newUser.email
    })
  } catch (error) {
    console.log("ERROR : ", error.message)
    return res.status(500).json({
      message: "something went wrong"
    })
  }
})

app.post("/login", async (req, res) => {
  
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