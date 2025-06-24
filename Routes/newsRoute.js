import express from 'express';
import { getAllNews } from '../Controllers/newsController.js';

const router = express.Router();

router.get('/all', getAllNews); // ✅ updated route

export default router;
