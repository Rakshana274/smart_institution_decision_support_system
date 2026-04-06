import express from 'express';
import { login, register, getProfile, updateProfile, getUsers } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.get('/users', getUsers);

export default router;
