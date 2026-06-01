import express from "express"
import { authMiddleware } from "../middlewares.js";

const testRouter = express.Router()

// testing middleware 
testRouter.get("/me", authMiddleware, (req, res) => {
  res.json({
    userId: req.userId
  })
})

export default testRouter;