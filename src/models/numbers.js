import mongoose from "mongoose";

// Number Schema (for storing btc and usd)
const NumberSchema = new mongoose.Schema({
  btc: { type: Number, default: 0 },
  usd: { type: Number, default: 0 },
});

// User Schema (with numbers as a nested object)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  numbers: { type: NumberSchema, required: true }, // Embedded NumberSchema for btc and usd
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
