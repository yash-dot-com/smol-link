import express from "express"
import dotenv from "dotenv"
import {db} from "./db.js"
import { usersTable } from "./schema/user.schema.js"

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

// authentication routes - will later organize in separate router
app.post("/signup", async (req,res)=>{
    // check if email already registered -> if yes -> 500 bad request already exists
    // if not then 
    // 1. hash user password
    // 2. store user in database
    // return 200 -> 201 user created message
    const user = req.body
    console.log(user)

    try{
        // check if already exists in database
        const user = await db.select().from(usersTable)
        if(!user){
            return res.status(500).json({
                message : "my bad bro no users avaiable"
            })
        }else{
            return res.status(200).json({
                message : "list of users",
                user,
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "something went wrong",
            error,
        })
    }
})

app.listen(PORT, ()=>{
    console.log("server running on port ", PORT)
})