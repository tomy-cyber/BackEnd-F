import mongoose from 'mongoose';

const numbersSchema = new mongoose.Schema({
  btc: { type: Number, default: 0 },
  usd: { type: Number, default: 0 },
}, { _id: false }); // Important: don't add _id to nested schema

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  numbers: {
    type: numbersSchema,
    default: () => ({ btc: 0, usd: 0 }),
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
