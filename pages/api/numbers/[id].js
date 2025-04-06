// es ,mushaobs

// import Cors from "cors"
// import connectDB from "../../../src/lib/connectDB"
// import User from "../../../src/models/User"
// import Number from "../../../src/models/numbers" // Import the Number model

// // Configure CORS
// const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
//   methods: ["GET", "PUT", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// })

// // Middleware helper
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         console.error("CORS middleware error:", result)
//         return reject(result)
//       }
//       return resolve(result)
//     })
//   })
// }

// export default async function handler(req, res) {
//   console.log("API Request:", req.method, req.url, req.query)

//   // Run CORS middleware
//   await runMiddleware(req, res, cors)

//   // Handle preflight OPTIONS request
//   if (req.method === "OPTIONS") {
//     return res.status(200).end()
//   }

//   // Connect to the database
//   try {
//     await connectDB()
//     console.log("Database connected successfully")
//   } catch (err) {
//     console.error("Database connection error:", err)
//     return res.status(500).json({ error: "Database connection error" })
//   }

//   // Get the user ID from the URL parameter
//   // Note: The file is named [id].js, so the parameter is available as req.query.id
//   const userId = req.query.id
//   console.log("User ID from query:", userId)

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" })
//   }

//   // GET request - fetch user's BTC & USD values
//   if (req.method === "GET") {
//     try {
//       console.log("Finding user with ID:", userId)

//       // Check if userId is valid MongoDB ObjectId
//       if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
//         console.error("Invalid user ID format")
//         return res.status(400).json({ error: "Invalid user ID format" })
//       }

//       // Find the user
//       const user = await User.findById(userId)
//       console.log("User found:", user ? "Yes" : "No")

//       if (!user) {
//         return res.status(404).json({ error: "User not found" })
//       }

//       // Find the associated Number document or create default values
//       let numberData = { btc: 0, usd: 0 }

//       if (user.numbers) {
//         // If the user has a reference to a Number document, fetch it
//         const numberDoc = await Number.findById(user.numbers)
//         if (numberDoc) {
//           numberData = {
//             btc: numberDoc.btc || 0,
//             usd: numberDoc.usd || 0,
//           }
//         }
//       }

//       console.log("Sending response:", numberData)
//       return res.status(200).json(numberData)
//     } catch (error) {
//       console.error("Error fetching user data:", error)
//       return res.status(500).json({ error: "Failed to fetch user data", details: error.message })
//     }
//   }

//   // PUT request - update user's BTC & USD values
//   else if (req.method === "PUT") {
//     try {
//       const { btc, usd } = req.body
//       console.log("Update request body:", { btc, usd })

//       // Find the user
//       const user = await User.findById(userId)
//       if (!user) {
//         console.log("User not found for update")
//         return res.status(404).json({ error: "User not found" })
//       }

//       // Find or create the Number document
//       let numberDoc

//       if (user.numbers) {
//         // If user already has a Number document, find it
//         numberDoc = await Number.findById(user.numbers)
//       }

//       if (!numberDoc) {
//         // If no Number document exists, create a new one
//         numberDoc = new Number({
//           btc: btc || 0,
//           usd: usd || 0,
//         })

//         // Save the new Number document
//         await numberDoc.save()

//         // Update the user with the reference to the new Number document
//         user.numbers = numberDoc._id
//         await user.save()
//       } else {
//         // Update the existing Number document
//         numberDoc.btc = btc !== undefined ? btc : numberDoc.btc || 0
//         numberDoc.usd = usd !== undefined ? usd : numberDoc.usd || 0
//         await numberDoc.save()
//       }

//       console.log("User balances updated successfully")

//       // Return success response
//       return res.status(200).json({
//         message: "User balances updated successfully",
//         btc: numberDoc.btc,
//         usd: numberDoc.usd,
//       })
//     } catch (error) {
//       console.error("Error updating user balances:", error)
//       return res.status(500).json({ error: "Failed to update user balances", details: error.message })
//     }
//   }

//   // Invalid method
//   else {
//     return res.status(405).json({ error: "Method Not Allowed" })
//   }
// }

// import Cors from "cors"
// import connectDB from "../../../src/lib/connectDB"
// import User from "../../../src/models/User"
// import Number from "../../../src/models/numbers"

// // Configure CORS
// const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
//   methods: ["GET", "PUT", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// })

// // Middleware helper
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         console.error("CORS middleware error:", result)
//         return reject(result)
//       }
//       return resolve(result)
//     })
//   })
// }

// export default async function handler(req, res) {
//   console.log("API Request:", req.method, req.url, req.query)

//   // Run CORS middleware
//   await runMiddleware(req, res, cors)

//   // Handle preflight OPTIONS request
//   if (req.method === "OPTIONS") {
//     return res.status(200).end()
//   }

//   // Connect to the database
//   try {
//     await connectDB()
//     console.log("Database connected successfully")
//   } catch (err) {
//     console.error("Database connection error:", err)
//     return res.status(500).json({ error: "Database connection error" })
//   }

//   const userId = req.query.id // Extract userId from URL
//   console.log("User ID from query:", userId)

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" })
//   }

//   // Check if userId is valid MongoDB ObjectId
//   if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
//     console.error("Invalid user ID format")
//     return res.status(400).json({ error: "Invalid user ID format" })
//   }

//   // GET request - fetch user's BTC & USD values
//   if (req.method === "GET") {
//     try {
//       console.log("Finding user with ID:", userId)

//       // Find the user
//       const user = await User.findById(userId)
//       console.log("User found:", user ? "Yes" : "No")

//       if (!user) {
//         return res.status(404).json({ error: "User not found" })
//       }

//       // Find the associated Number document or create default values
//       let numberData = { btc: 0, usd: 0 }

//       if (user.numbers) {
//         // If the user has a reference to a Number document, fetch it
//         const numberDoc = await Number.findById(user.numbers)
//         if (numberDoc) {
//           numberData = {
//             btc: numberDoc.btc || 0,
//             usd: numberDoc.usd || 0,
//           }
//         }
//       }

//       console.log("Sending response:", numberData)
//       return res.status(200).json(numberData)
//     } catch (error) {
//       console.error("Error fetching user data:", error)
//       return res.status(500).json({ error: "Failed to fetch user data", details: error.message })
//     }
//   }

//   // PUT request - update user's BTC & USD values
// //   else if (req.method === "PUT") {
// //     try {
// //       const { btc, usd } = req.body
// //       console.log("Update request body:", { btc, usd })

// //       // Find the user
// //       const user = await User.findById(userId)
// //       if (!user) {
// //         console.log("User not found for update")
// //         return res.status(404).json({ error: "User not found" })
// //       }

// //       // Find or create the Number document
// //       let numberDoc

// //       if (user.numbers) {
// //         // If user already has a Number document, find it
// //         numberDoc = await Number.findById(user.numbers)
// //       }

// //       if (!numberDoc) {
// //         // If no Number document exists, create a new one
// //         numberDoc = new Number({
// //           btc: btc || 0,
// //           usd: usd || 0,
// //         })

// //         // Save the new Number document
// //         await numberDoc.save()

// //         // Update the user with the reference to the new Number document
// //         user.numbers = numberDoc._id
// //         await user.save()
// //       } else {
// //         // Update the existing Number document
// //         numberDoc.btc = btc !== undefined ? btc : numberDoc.btc || 0
// //         numberDoc.usd = usd !== undefined ? usd : numberDoc.usd || 0
// //         await numberDoc.save()
// //       }

// //       console.log("User balances updated successfully")

// //       // Return success response
// //       return res.status(200).json({
// //         message: "User balances updated successfully",
// //         btc: numberDoc.btc,
// //         usd: numberDoc.usd,
// //       })
// //     } catch (error) {
// //       console.error("Error updating user balances:", error)
// //       return res.status(500).json({ error: "Failed to update user balances", details: error.message })
// //     }
// //   }
//   // PUT request - update user's BTC & USD values
// else if (req.method === "PUT") {
//     try {
//       const { btc, usd } = req.body
//       console.log("Update request body:", { btc, usd })
  
//       // Find the user
//       const user = await User.findById(userId)
//       if (!user) {
//         console.log("User not found for update")
//         return res.status(404).json({ error: "User not found" })
//       }
  
//       // Ensure the user has a Number document
//       if (!user.numbers) {
//         console.log("User does not have a number document, creating one.")
//         const newNumber = await Number.create({ btc: btc || 0, usd: usd || 0 })
//         user.numbers = newNumber._id
//         await user.save()
//         return res.status(200).json({ btc: newNumber.btc, usd: newNumber.usd })
//       }
  
//       // Update the existing Number document
//       const updatedNumber = await Number.findByIdAndUpdate(
//         user.numbers,
//         { btc, usd },
//         { new: true } // ✅ Ensures the updated document is returned
//       )
  
//       console.log("User balances updated successfully", updatedNumber)
  
//       return res.status(200).json({
//         message: "User balances updated successfully",
//         btc: updatedNumber.btc,
//         usd: updatedNumber.usd,
//       })
//     } catch (error) {
//       console.error("Error updating user balances:", error)
//       return res.status(500).json({ error: "Failed to update user balances", details: error.message })
//     }
//   }
  
//   // Invalid method
//   else {
//     return res.status(405).json({ error: "Method Not Allowed" })
//   }
// }

