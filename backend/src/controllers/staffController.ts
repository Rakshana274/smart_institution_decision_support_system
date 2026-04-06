import { Request, Response } from 'express';
import { Staff } from '../models/Staff';
import { Student } from '../models/Student';

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    
    // Clear assigned staff id from students
    await Student.updateMany({ assignedStaffId: id }, { $unset: { assignedStaffId: 1 } });
    
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
