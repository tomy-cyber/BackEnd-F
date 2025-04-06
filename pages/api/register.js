// import connectToDatabase from "../../src/lib/connectDB";
// import User from "../../src/models/User"
// import bcrypt from "bcryptjs"
// import Cors from "cors"

// const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3002"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["*"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// });

// // Helper to run middleware
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result)
//       }
//       return resolve(result)
//     })
//   })
// }

// export default async function handler(req, res) {
//   // Run CORS middleware
//   await runMiddleware(req, res, cors)

//   // Handle CORS preflight
//   if (req.method === "OPTIONS") {
//     return res.status(200).end()
//   }

//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" })
//   }

//   try {
//     // Log the request body for debugging
//     console.log("Registration request body:", req.body)

//     // Validate required fields
//     const { name, email, username, password } = req.body

//     if (!name || !email || !username || !password) {
//       return res.status(400).json({
//         error: "Missing required fields",
//         missing: Object.entries({ name, email, username, password })
//           .filter(([_, value]) => !value)
//           .map(([key]) => key),
//       })
//     }

//     // Connect to database
//     await connectToDatabase()
//     console.log("✅ Database connected!")

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     })

//     if (existingUser) {
//       const field = existingUser.email === email ? "email" : "username"
//       return res.status(400).json({ error: `User with this ${field} already exists` })
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//       btc: 0,
//       usd: 0,
//     })

//     // Save user to database
//     await newUser.save()
//     console.log("✅ User registered successfully:", email)

//     // Return success response without sensitive data
//     return res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         username: newUser.username,
//       },
//     })
//   } catch (error) {
//     // Detailed error logging
//     console.error("❌ Registration Error:", error)

//     // Check for MongoDB duplicate key error
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0]
//       return res.status(400).json({
//         error: `User with this ${field} already exists`,
//       })
//     }

//     // Return appropriate error response
//     return res.status(500).json({
//       error: "Server error",
//       message: error.message,
//     })
//   }
// }

import connectToDatabase from "../../src/lib/connectDB"
import User from "../../src/models/User"
import bcrypt from "bcryptjs"
import Cors from "cors"

const cors = Cors({
  origin: ["https://front-end-f.vercel.app", "http://localhost:3002"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"],
  credentials: true,
  optionsSuccessStatus: 200,
})

// Helper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors)

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    // Log the request body for debugging
    console.log("Registration request body:", req.body)

    // Validate required fields
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: Object.entries({ name, email, username, password })
          .filter(([, value]) => !value) // Remove the underscore to avoid unused variable
          .map(([key]) => key), // Only use key for mapping
      })
    }

    // Connect to database
    await connectToDatabase()
    console.log("✅ Database connected!")

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username"
      return res.status(400).json({ error: `User with this ${field} already exists` })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      btc: 0,
      usd: 0,
    })

    // Save user to database
    await newUser.save()
    console.log("✅ User registered successfully:", email)

    // Return success response without sensitive data
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      },
    })
  } catch (error) {
    // Detailed error logging
    console.error("❌ Registration Error:", error)

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        error: `User with this ${field} already exists`,
      })
    }

    // Return appropriate error response
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    })
  }
}

