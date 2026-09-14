import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/united-mart-sukkur';

mongoose.set('strictQuery', true);

// Caches the CONNECTION PROMISE itself, not just a boolean flag — so if
// several requests hit a cold serverless instance at the same time (which
// happens constantly, since one page load fires many parallel API calls),
// they all await the SAME in-flight connection instead of each racing to
// open its own fresh connection to MongoDB Atlas. This is the standard fix
// for the "serverless + Mongoose" cold-start pattern.
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        autoIndex: process.env.NODE_ENV !== 'production',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null; // allow a real retry on the next request, instead of staying permanently broken
        console.error(`MongoDB connection failed: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

mongoose.connection.on('disconnected', () => {
  connectionPromise = null;
  console.warn('MongoDB disconnected');
});

export default connectDB;