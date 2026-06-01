import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import testRouter from "./routes/test.routes.js"

dotenv.config()

const app = express()
app.use(cookieParser())
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use("/", authRouter)
app.use("/", testRouter)

app.get("/health", async (req,res)=>{
    return res.status(200).json({
        health: "OK",
        code: 200
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