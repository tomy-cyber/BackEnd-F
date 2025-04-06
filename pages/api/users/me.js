// This file should be created on your backend (port 3001)
import Cors from "cors"
import connectToDatabase from "../../../src/lib/connectDB"
import User from "../../../src/models/User"
import jwt from "jsonwebtoken"

const cors = Cors({
  origin: "https://f-frontend-rho.vercel.app",
  methods: ["GET"],
  credentials: true,
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result)
      return resolve(result)
    })
  })
}

// 🔐 Helper: Get userId from Authorization header
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId // This assumes your token contains userId
  } catch (err) {
    console.error("Invalid token:", err.message)
    return null
  }
}

const handler = async (req, res) => {
  await runMiddleware(req, res, cors)

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const userId = getUserIdFromToken(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing token" })
  }

  try {
    await connectToDatabase()

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Return user data including username, email, name and numbers
    return res.status(200).json({
      _id: user._id,
      username: user.username || user.email,
      email: user.email,
      name: user.name || "",
      numbers: user.numbers || { btc: 0, usd: 0 },
    })
  } catch (err) {
    console.error("Error fetching user:", err)
    return res.status(500).json({ error: "Server error: " + err.message })
  }
}

export default handler

