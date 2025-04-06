import connectToDatabase from "../../src/lib/connectDB";
import User from "../../src/models/User";
import Cors from 'cors';

// Initialize CORS
const cors = Cors({
  origin: ["https://f-frontend-rho.vercel.app", "http://localhost:3002"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// Middleware helper
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase(); // Just connect, no need to get db object
    const users = await User.find({}); // Use the Mongoose model to fetch users

    console.log("Fetched Users:", users);

    return res.status(200).json(users);
  } catch (error) { 
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
}
