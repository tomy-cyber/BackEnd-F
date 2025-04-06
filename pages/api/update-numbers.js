// import Cors from 'cors';
// import { ObjectId } from "mongodb";
// import connectToDatabase from "../../src/lib/connectDB";
// import User from "../../src/models/User"; // ✅ Import your User model

// // Initialize CORS
// const cors = Cors({
//   origin: "http://localhost:3002", // Allow frontend
//   methods: ["PUT"],
//   credentials: true,
// });

// // Middleware helper
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) return reject(result);
//       return resolve(result);
//     });
//   });
// }

// const handler = async (req, res) => {
//   await runMiddleware(req, res, cors); // Apply CORS middleware

//   if (req.method === "PUT") {
//     try {
//       const { userId, btc, usd } = req.body;
//       console.log("Received Data:", req.body); // Debugging

//       if (!userId || isNaN(btc) || isNaN(usd)) {
//         return res.status(400).json({ error: "Invalid input data" });
//       }

//       await connectToDatabase(); // Just connect, no need to get "db"

//       const user = await User.findById(userId); // ✅ Mongoose way

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       user.btc = btc;
//       user.usd = usd;
//       await user.save(); // ✅ Save the updates

//       return res.status(200).json({ message: "User numbers updated successfully" });
//     } catch (err) {
//       console.error("Error updating numbers:", err);
//       return res.status(500).json({ error: "Server error: " + err.message });
//     }
//   } else {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
// };

// export default handler;
import Cors from 'cors';
import connectToDatabase from '../../src/lib/connectDB';
import User from '../../src/models/User';

const cors = Cors({
  origin: 'https://admin-panel-kappa-lyart.vercel.app',
  methods: ['PUT'],
  credentials: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

const handler = async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === 'PUT') {
    try {
      const { userId, btc, usd } = req.body;

      console.log('Received Data:', req.body);

      if (!userId || isNaN(btc) || isNaN(usd)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      await connectToDatabase();

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure numbers exists
      if (!user.numbers) {
        user.numbers = { btc: 0, usd: 0 };
      }

      user.numbers.btc = btc;
      user.numbers.usd = usd;

      await user.save();

      return res.status(200).json({ message: 'User numbers updated successfully' });
    } catch (err) {
      console.error('Error updating numbers:', err);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
