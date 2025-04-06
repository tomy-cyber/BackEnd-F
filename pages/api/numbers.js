import Cors from 'cors';
import connectToDatabase from '../../src/lib/connectDB';
import User from '../../src/models/User';
import jwt from 'jsonwebtoken';

const cors = Cors({
  origin: 'https://f-frontend-rho.vercel.app',
  methods: ['GET', 'PUT'],
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

// 🔐 Helper: Get userId from Authorization header
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId; // This assumes your token contains userId
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}

const handler = async (req, res) => {
  await runMiddleware(req, res, cors);

  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }

  await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const { btc, usd } = req.body;
      console.log('Received Data:', req.body);

      if (isNaN(btc) || isNaN(usd)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

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
  } else if (req.method === 'GET') {
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json({
        usd: user.numbers?.usd || 0,
        btc: user.numbers?.btc || 0,
      });
    } catch (err) {
      console.error('Error fetching numbers:', err);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
