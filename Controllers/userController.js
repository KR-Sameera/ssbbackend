import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import imagekit from '../config/imagekit.js';
import fs from 'fs';
import path from 'path';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup
export const signupUser = async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });

    const token = generateToken(newUser._id);

    const userData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
    };

    res.status(201).json({ success: true, user: userData, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'No user found with that email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Incorrect password' });

    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    };

    res.status(200).json({ success: true, user: userData, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

//Update user
export const updateProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to ImageKit
    const imageUpload = await imagekit.upload({
      file: fs.readFileSync(imageFile.path),
      fileName: imageFile.originalname,
      folder: 'users',
    });

    // Remove local temp file
    fs.unlinkSync(imageFile.path);

    // Save the ImageKit URL in user profile
    user.profilePic = imageUpload.url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated',
      profilePic: imageUpload.url,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile picture', error: err.message });
  }
};

