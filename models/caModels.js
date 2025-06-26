import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  category: String,
});

const currentAffairSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  articles: [articleSchema],
});

export default mongoose.model('CurrentAffair', currentAffairSchema);
