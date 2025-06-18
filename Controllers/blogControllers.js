import Blog from '../models/blogModels.js';
import imagekit from '../config/imagekit.js';
import fs from 'fs';

export const createBlog = async (req, res) => {
  try {
    const { title, content, categories, date, publisher, } = req.body;
    const imageFile = req.file;

  const imageUpload = await imagekit.upload({
            file: fs.readFileSync(imageFile.path),
            fileName: imageFile.originalname,
            folder: "SSBblogs", // optional folder
        });
        
        const imageUrl = imageUpload.url;

    const blog = await Blog.create({
      title,
      image: imageUrl,
      content,
      categories,
      date,
      publisher,
      userId: req.userId,
    });

    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create blog', error: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.userId });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user blogs', error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

export const getRelatedBlogs = async (req, res) => {
  try {
    const { category, blogId } = req.query;
    const blogs = await Blog.find({ categories: category, _id: { $ne: blogId } }).limit(3);
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching related blogs', error: err.message });
  }
};
