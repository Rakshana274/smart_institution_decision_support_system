import express from 'express';
import { getStaff, createStaff, deleteStaff, updateStaff } from '../controllers/staffController';

const router = express.Router();

router.get('/', getStaff);
router.post('/', createStaff);
router.delete('/:id', deleteStaff);
router.put('/:id', updateStaff);

export default router;
