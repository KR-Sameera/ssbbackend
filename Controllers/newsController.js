// backend/controllers/newsController.js
import News from '../models/newsModels.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
};
