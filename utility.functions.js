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

// for (let i = 0; i < 10; i++){
//   console.log(generateShortcode())
// }