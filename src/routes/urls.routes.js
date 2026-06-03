import express from "express"
import generateShortcode from "../utility.functions.js"
import { urlsTable } from "../schema/urls.schema.js"
import { authMiddleware } from "../middlewares.js"
import { db } from "../db.js"
import { usersTable } from "../schema/user.schema.js"
import { eq } from "drizzle-orm"

const urlsRouter = express.Router()

// all urls created by a particular user 
urlsRouter.get("/urls/", authMiddleware,async (req, res) => {
  try {
    const id = req.userId
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
  try {
    // check if userId exists in req and longUrl exists req.body object -> early return if not present
    if (!req.userId) {
      return res.status(419).json({
        message: "ERROR : Unauthorized"
      })
    } 
  
    // check if userId is valid / user exists -> early return if not exists
    const user = await db.select({
      userId: usersTable.id
    }).from(usersTable).where(eq(usersTable.id, id));
  
    if (user.length === 0) {
      return res.status(404).json({
        message: "ERROR : user not found"
      })
    }
  
    // check if request body has longUrl -> early return if not present
    const { longUrl } = req.body
    if (!longUrl) {
      return res.status(400).json({
       message: "ERROR : bad request, longUrl is required"
     })
    } 
  
    let shortCodeExistsAlready = [];
    do { 
      const shortCode = generateShortcode()
      shortCodeExistsAlready = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, shortCode))
    } while (shortCodeExistsAlready.length === 0)
  
    const [newUrlEntry] = await db.insert(urlsTable).values({
      userId: req.userId,
      originalUrl: longUrl,
      shortUrl: shortCode,
    }).returning()
  
    if (newUrlEntry.length) {
      return res.status(500).json({
        message: "ERROR : internal server error, couldn't insert entry"
      })
    }
  
    return res.status(201).json({
      message: "SUCCESS : entry created successfully",
      originalUrl: longUrl,
      shortUrl: `http:localhost:${process.env.PORT}/shortlink/${shortCode}`
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : internal server error"
    })
 }
})

// redirection route, this is accessible by any user - auth and unauth both
urlsRouter.get("/shortlink/:shortcode", async (req, res) => {
  const shortCode = req.params.shortcode 
  console.log(shortCode)
  
  if (!shortCode) {
    return res.status(429).json({
      message: "ERROR : shortcode is required"
    })
  }
  
  try {
    // check if shortCode is stored in database -> early return if not 
    const [shortCodeMapping] = await db.select({
      originalUrl: urlsTable.originalUrl,
      shortCode: urlsTable.shortCode,
    }).from(urlsTable).where(eq(urlsTable.shortCode, shortCode))

    
    // if yes
    if (!shortCodeMapping) {
      return res.status(404).json({
        message: "ERROR : url not found"
      })
    }

    let destinationUrl = shortCodeMapping.originalUrl

    if (!/^https?:\/\//i.test(destinationUrl)) {
      destinationUrl = `https://${destinationUrl}`;
    }
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.redirect(302, destinationUrl);

    console.log("redirecting to original link")
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : something went wrong, internal server error"
    })
  }
})

// get information about one particular url 
urlsRouter.get("/urls/:shortcode",authMiddleware, async (req, res) => {
  const code = req.params.shortcode
  // this will get messed up because 2 users might get same shortcode if any collisions occur.
  // to implement monitoring we need to have unique shortcode compulsorily. 
  // one core shortcoming -> randomly generate code gets checked against db entries every time -> read fatigue
  // but looking at scale we can just implement simple things
  try {
    
  }
})
export default urlsRouter;