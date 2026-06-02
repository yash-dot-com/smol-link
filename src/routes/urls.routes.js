import express from "express"
import generateShortcode from "../utility.functions.js"
import { urlsTable } from "../schema/urls.schema.js"
import { authMiddleware } from "../middlewares.js"
import { db } from "../db.js"
import { usersTable } from "../schema/user.schema.js"
import { eq } from "drizzle-orm"

const urlsRouter = express.Router()

// all urls created by a particular user 
urlsRouter.get("/urls/:id", authMiddleware,async (req, res) => {
  const id = req.params.id

  try {
    // find if user exists, if yes then return all the urls user made
    const user = await db.select({
      userId: usersTable.id
    }).from(usersTable).where(eq(usersTable.id, id))

    if (user.length === 0) {
      return res.status(429).json({
        message: "ERROR : user doesn't exists"
      })
    }

    // no need to joins, filter and return urls with userId == id 
    const userAllUrls = await db.select().from(urlsTable).where(eq(urlsTable.userId, id))
    if (userAllUrls.length === 0) {
      return res.status(200).json({
        message: "ERROR : user doesn't have any urls created"
      })
    }

    return res.status(200).json(userAllUrls)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "something went wrong"
    })
  }
})  

// route to create entry in urls table 
urlsRouter.post("/urls", authMiddleware, async (req, res) => {
  
})
export default urlsRouter;