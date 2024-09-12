import express from 'express';
import { register, login, getUserProfile, editUserProfile } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:email', getUserProfile);
router.post('/edit-profile/:email', editUserProfile);

export default router;
