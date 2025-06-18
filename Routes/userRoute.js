import express from 'express';
import { signupUser, loginUser, updateProfilePic } from '../Controllers/userController.js';
import upload from '../middlewares/multer.js';
import { protect } from '../middlewares/authUser.js';

const router = express.Router();


router.post('/signup', signupUser);
router.post('/login', loginUser);
router.put('/update-profile-pic', protect, upload.single('profilePic'), updateProfilePic);

export default router;
