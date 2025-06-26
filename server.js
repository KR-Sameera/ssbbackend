import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRoutes from './Routes/userRoute.js';
import blogRoutes from './Routes/blogRoute.js';
import currentAffairsRoutes from './Routes/caRoute.js';
import { startDailyNewsJob } from './cron/dailyNewsJob.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/currentaffairs', currentAffairsRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startDailyNewsJob(); // ✅ Start daily cron job
});
