import express from 'express';
import { getStudents, createStudent, deleteStudent, assignStaff, getStudentsByStaff } from '../controllers/studentController';

const router = express.Router();

router.get('/', getStudents);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.put('/:id/assign', assignStaff);
router.get('/staff/:staffId', getStudentsByStaff);

export default router;
