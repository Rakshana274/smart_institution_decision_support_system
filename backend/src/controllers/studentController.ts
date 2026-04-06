import { Request, Response } from 'express';
import { Student } from '../models/Student';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // student id
    const { staffId } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      id, 
      staffId ? { assignedStaffId: staffId } : { $unset: { assignedStaffId: 1 } },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentsByStaff = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.params;
    const students = await Student.find({ assignedStaffId: staffId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
