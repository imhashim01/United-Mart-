import app from '../app.js';
import connectDB from '../src/config/db.js';
await connectDB();
export default app;