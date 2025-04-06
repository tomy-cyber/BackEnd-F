  // import mongoose from "mongoose";

  // const MONGODB_URI = process.env.MONGODB_URI;
  // if (!MONGODB_URI) {
  //   throw new Error("Please define the MONGODB_URI environment variable");
  // }

  // let cached = global.mongoose;
  // if (!cached) {
  //   cached = global.mongoose = { conn: null, promise: null };
  // }

  // async function connectToDatabase() {
  //   if (cached.conn) {
  //     return cached.conn;
  //   }
  //   if (!cached.promise) {
  //     cached.promise = mongoose.connect(MONGODB_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       // Either remove bufferCommands or set it to true so that commands are buffered.
  //       bufferCommands: true,
  //     });
  //   }
  //   cached.conn = await cached.promise;
  //   return cached.conn;
  // }

  // export default connectToDatabase;
// lib/connectDB.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
