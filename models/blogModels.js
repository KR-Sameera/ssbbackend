import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  categories: { type: String, required: true },
  date: { type: Date, default: Date.now },
  publisher: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Blog', blogSchema);
