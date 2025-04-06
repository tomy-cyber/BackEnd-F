// import jwt from "jsonwebtoken";

// export function verifyToken(req) {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return null;

//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     console.error("JWT verification failed:", error);
//     return null;
//   }
// }
// import jwt from "jsonwebtoken";
// import User from "../models/User";
// import connectDB from "../lib/connectDB";

// export const verifyToken = async (req) => {
//   try {
//     await connectDB();

//     // Extract token from headers
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       console.log("No token provided");
//       return null; // Return null instead of using res.status()
//     }

//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       console.log("User not found");
//       return null;
//     }

//     return user; // Return the user object
//   } catch (error) {
//     console.error("JWT verification error:", error.message);
//     return null; // Ensure consistent return
//   }
// };
// backend/utils/auth.js
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//     req.user = decoded; // Attach user data to request object
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };

// module.exports = { verifyToken };
// import jwt from "jsonwebtoken"

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1] // Get token from Authorization header

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify token
//     req.user = decoded // Attach user data to request object
//     next()
//   } catch (
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     error
//   ) {
//     return res.status(401).json({ error: "Unauthorized: Invalid token" })
//   }
// }

// export { verifyToken }
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify token
    req.user = decoded // Attach user data to request object
    next()
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}

module.exports = { verifyToken }

