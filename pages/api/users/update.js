import Cors from "cors"
import connectDB from "../../../src/lib/connectDB"
import User from "../../../src/models/User"

// CORS Setup
const cors = Cors({
  methods: ["PUT", "OPTIONS"],
  origin: ["https://f-frontend-rho.vercel.app", "http://localhost:3002"],
  credentials: true,
})

// Middleware Helper
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        console.error("CORS Middleware Error:", result)
        return reject(result)
      }
      return resolve(result)
    })
  })

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors)

    if (req.method === "OPTIONS") {
      return res.status(200).end()
    }

    if (req.method === "PUT") {
      await connectDB()

      // Get the first user (or you can use a specific user ID if needed)
      const user = await User.findOne({})

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Update user fields
      const { name, email } = req.body

      if (name) user.name = name
      if (email) user.email = email

      // Save the updated user
      await user.save()

      return res.status(200).json({
        message: "User updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      })
    }

    res.status(405).json({ error: "Method Not Allowed" })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}

