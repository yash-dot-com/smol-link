import express from "express"
import dotenv from "dotenv"

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



app.listen(PORT, ()=>{
    console.log("server running on port ", PORT)
})