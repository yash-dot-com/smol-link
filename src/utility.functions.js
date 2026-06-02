import { urlsTable } from "./schema/urls.schema.js"

// base62 shortcode generator
export default function generateShortcode() {
  const seedCode = "ABCDEFGHIJKLMNOPQRSTUVWZYXabcdefghijklmnopqrstuvwxyz0123456789"
  let shortCode = ""
  for (let i = 0; i < 5; i++){
    const randomIndex = Math.floor(Math.random() * seedCode.length)
    const char = seedCode[randomIndex]
    shortCode += char
  }

  return shortCode;
}

// testing uniqueness
// for (let i = 0; i < 10; i++){
//   console.log(generateShortcode())
// }

// utility function to check whether generated shortcode is unique for database, if not generate new again until its unique 
export async function checkUniqueShortCode(shortCode) {
  
}