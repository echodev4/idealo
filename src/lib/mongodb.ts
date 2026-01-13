import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("MongoDB Connected (Next.js)");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
