import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRoutes from './Routes/userRoute.js';
import blogRoutes from './Routes/blogRoute.js';


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes); // ✅ Ensure blogRoutes mounted correctly


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));