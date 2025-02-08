import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const DB_NAME = "ToRentData";

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // ✅ Explicitly specify the database
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Prevent Mongoose from buffering
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
