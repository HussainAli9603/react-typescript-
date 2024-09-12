import express from 'express';
import { register } from '../controllers/authController';
import { login } from '../controllers/authController';
import { getUserProfile } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:email', getUserProfile);

export default router;
