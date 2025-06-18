import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
