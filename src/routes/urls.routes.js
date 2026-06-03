import express from "express"
import generateShortcode from "../utility.functions.js"
import { urlsTable } from "../schema/urls.schema.js"
import { authMiddleware } from "../middlewares.js"
import { db } from "../db.js"
import { usersTable } from "../schema/user.schema.js"
import { eq } from "drizzle-orm"
import dotenv from "dotenv"
import { logTable } from "../schema/logtable.schema.js"
import { and, eq, sql } from "drizzle-orm"
dotenv.config()

// utility function 
async function createUniqueShortCode() {
  let shortCode, result;
  do {
    // generate unique shortcode, check in db if it exists, repeat until it does not (for trust uniqueness)
    shortCode = generateShortcode()
    // check in database
    [result] = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, shortCode))
    // if result is empty / undefined object -> shortCode is unique to db -> move forward and insert it,
    // else -> repeat

    // or another way is to check if the array is empty or not 
    // while(result.length !== 0)
  } while (result !== undefined)

  return shortCode;
}
// getOS function
function getOS(ua) {
  if (/windows nt/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}
// baseUrl of the platform for constructing shortlink after shortcode is generateShortcode
const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`

const urlsRouter = express.Router()

// all urls created by a particular user 
urlsRouter.get("/urls", authMiddleware,async (req, res) => {
  try {
    const id = req.userId
    // redundant because we are already using authmiddleware 
    // // find if user exists, if yes then return all the urls user made
    // const user = await db.select({
    //   userId: usersTable.id
    // }).from(usersTable).where(eq(usersTable.id, id))

    // if (user.length === 0) {
    //   return res.status(429).json({
    //     message: "ERROR : user doesn't exists"
    //   })
    // }

    // no need to joins, filter and return urls with userId == id 
    const userAllUrls = await db.select().from(urlsTable).where(eq(urlsTable.userId, id))
    if (userAllUrls.length === 0) {
      return res.status(200).json({
        message: "ERROR : user doesn't have any urls created"
      })
    }

    // otherwise send all urls
    return res.status(200).json(userAllUrls)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "something went wrong"
    })
  }
})  

// route to create entry in urls table 
// data incoming : long url and userId from auth 
// data output required : creation of unique shortcode for long url and persist it in db and send back to user 
urlsRouter.post("/urls", authMiddleware, async (req, res) => {
  // extract longUrl & userId from request 
  const { longUrl } = req.body
  const userId = req.userId

  // if payload empty -> early return
  // 
  if (!longUrl) {
    return res.status(400).json({
     message: "ERROR : bad request, longUrl is required"
   })
  } 

  // check if longUrl is actually an valid url form 
  try {
    new URL(longUrl)
  } catch {
    return res.status(400).json({
      message: "Invalid URL, make sure to add http:// or https:// as well"  
    })
  }

  // check if userId exists in req and longUrl exists req.body object -> early return if not present
  if (!userId) {
    return res.status(401).json({
      message: "ERROR : Unauthorized"
    })
  } 
  
  try {
    // NOTE 
    // redundant -> because if the user is authenticated then user DOES exists FOR SURE.
    
    // // check if userId is valid / user exists -> early return if not exists
    // const user = await db.select({
    //   userId: usersTable.id
    // }).from(usersTable).where(eq(usersTable.id, id));
  
    // if (user.length === 0) {
    //   return res.status(404).json({
    //     message: "ERROR : user not found"
    //   })
    // }

    const shortCode = await createUniqueShortCode()
    
    // extracting newEntry object
    const [newUrlEntry] = await db.insert(urlsTable).values({
      userId,
      originalUrl: longUrl,
      shortCode,
    }).returning()
  
    if (!newUrlEntry) {
      return res.status(500).json({
        message: "ERROR : internal server error, couldn't insert entry"
      })
    }
  
    return res.status(201).json({
      message: "SUCCESS : entry created successfully",
      originalUrl: longUrl,
      shortUrl: `${baseUrl}/shortlink/${shortCode}`
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : internal server error"
    })
 }
})

// metadata about particular url
urlsRouter.get("/urls/:shortcode",authMiddleware, async (req, res) => {
  const code = req.params.shortcode
  const userId = req.userId

  if (!code) {
    return res.status(400).json({
      message: "ERROR : shortcode is  required"
    })
  }

  // redundant check, authMiddleware already checks this
  if (!userId) {
    return res.status(401).json({
      message: "ERROR : Unauthorized"
    })
  }
  
  try {
    const [urlData] = await db.select({
      urlId: urlsTable.urlId,
      originalUrl: urlsTable.originalUrl,
      shortCode: urlsTable.shortCode,
      createdAt: urlsTable.createdAt,
    }).from(urlsTable).where(and(eq(urlsTable.shortCode, code), eq(urlsTable.userId,userId)))
    if (!urlData) {
      return res.status(404).json({
        message: "ERROR : shortcode doesn't exist"
      })
    }
    return res.status(200).json(urlData)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : Internal Server Error"
    })
  }
})

// get all logs for one particular url 
urlsRouter.get("/urls/:shortcode/analytics",authMiddleware, async (req, res) => {
  const code = req.params.shortcode
  const userId = req.userId
  // this will get messed up because 2 users might get same shortcode if any collisions occur.
  // to implement monitoring we need to have unique shortcode compulsorily. 
  // one core shortcoming -> randomly generate code gets checked against db entries every time -> read fatigue
  // but looking at scale we can just implement simple unique shortcode generation
  // the concern stated above has been resolved. 
  try {
    const logs = await db.select().from(logTable).where(and(
      eq(logTable.shortCode, code),
      eq(logTable.userId, userId)
    ))
    
    if (logs.length === 0) {
      return res.status(404).json({
        message: "ERROR : url doesn't exists"
      })
    }

    return res.status(200).json(logs)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

// delete particular url
urlsRouter.delete("/urls/:shortcode", authMiddleware, async (req, res) => {
  const userId = req.userId
  
  if (!userId) {
    return res.status(401).json({
      message: "ERROR : Unauthorized"
    })
  }

  const shortcode = req.params.shortcode
  if (!shortcode) {
    return res.status(400).json({
      message: "ERROR : shortcode is required"
    })
  }

  try {
    
    const deleted = await db.delete(urlsTable).where(and(
      eq(urlsTable.shortCode, shortcode),
      eq(urlsTable.userId, userId)
    )).returning()

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "ERROR : url not found"
      })
    }

    return res.status(200).json({
      message: "SUCCESS : url deleted successfully"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : Internal Server Error"
    })
  }
})

// redirection route, this is accessible by any user - auth and unauth both
urlsRouter.get("/:shortcode", async (req, res) => {
  const shortCode = req.params.shortcode 
  console.log(shortCode)
  
  if (!shortCode) {
    return res.status(400).json({
      message: "ERROR : shortcode is required"
    })
  }
  
  try {
    // check if shortCode is stored in database -> early return if not 
    const [shortCodeMapping] = await db.select({
      originalUrl: urlsTable.originalUrl,
      shortCode: urlsTable.shortCode,
      urlId: urlsTable.id,
    }).from(urlsTable).where(eq(urlsTable.shortCode, shortCode))

    
    // if not url not found in database
    if (!shortCodeMapping) {
      return res.status(404).json({
        message: "ERROR : url not found"
      })
    }

    // otherwise
    let destinationUrl = shortCodeMapping.originalUrl
    // add request metadata for analysis in the database. 
    // increase click count (need unique how?) -> 
    // client type -> user-agent string
    // accept-language header ->
    // referer header -> 
    const rawUserAgent = req.headers["user-agent"] || ""
    const referrer = req.headers["referer"] || ""

    let browser = getOS(rawUserAgent)
    let ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";

    // insert into log table 
    await db.transaction(async (tx) => {
      await tx.insert(logTable).values({
        urlId: shortCodeMapping.urlId,
        browser,
        ip,
        referrer,
        shortCode: shortCodeMapping.shortCode,
      })

      await tx.update(urlsTable).set({
        clickCount: sql`${urlsTable.clickCount}+1`
      }).where(eq(urlsTable.id, shortCodeMapping.urlId))
    })
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    console.log("redirecting to original link")
    return res.redirect(302, destinationUrl);
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "ERROR : something went wrong, internal server error"
    })
  }
})


export default urlsRouter;
