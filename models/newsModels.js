// models/newsModel.js
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  url: String,
  imageUrl: String,
  publishedAt: Date,
  category: String,
});

export default mongoose.model('News', newsSchema);
