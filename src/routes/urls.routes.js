import express from "express"
import generateShortcode from "../utility.functions"
import { urlsTable } from "../schema/urls.schema"

const urlsRouter = express.Router()

// create entry for a longrul in database.
urlsRouter.post("/urls", async (req, res) => {
  const { longUrl } = req.body
  // generate shortcode
  const shortCode = generateShortcode()
  try {
    const [exists] = await db.select().from(urlsTable).where(eq(urlsTable.originalUrl, longUrl)).limit(1)
    if (exists.length) {
      const [uniqueShortCode] = await db.select({ shortCode }).from(urlsTable).where(eq(urlsTable.originalUrl, longUrl))
      urlsRouter.redirect(`/${uniqueShortCode}`)
    }

    // if originalUrl doesn't has entry in database 
    // generate random shortcode -> check if its unique -> assign to originalUrl -> insert entry in database (uniqueShortCode, originalUrl)
    // return generated shortCode to user in response body
    // needs a utility function to check whether generated shortcode is unique or not. ->
    // continue from tomorrow 
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`
    })
  }
})

// delete an entry from urls table 
urlsRouter.delete("/urls", async (req, res) => {
  
})

// get metadata / information about single url 
urlsRouter.get("/urls/:shortcode", async (req, res) => {
  
})

// redirection using shortcode
urlsRouter.get("/:shortcode", async (req, res) => {
  
})

// list of all urls created by particular user 
urlsRouter.get("/urls", async (req, res) => {
  
})

export default urlsRouter;