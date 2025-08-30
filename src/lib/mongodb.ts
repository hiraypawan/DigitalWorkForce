import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not defined in environment variables');
}

// Global cache for MongoDB connection
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not defined in environment variables');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Save to global for hot reload persistence
if (!global.mongoose) {
  global.mongoose = cached;
}
