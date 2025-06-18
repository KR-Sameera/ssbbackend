import express from 'express';
import { protect } from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

import {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  getRelatedBlogs
} from '../Controllers/blogControllers.js';



const router = express.Router();

router.post('/create', protect, upload.single('imageFile'), createBlog);
router.get('/', getAllBlogs);
router.get('/myblogs', protect, getMyBlogs);
router.get('/related', getRelatedBlogs);
router.get('/:id', getBlogById);


export default router;