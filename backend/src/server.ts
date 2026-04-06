import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes';
import { User } from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://raksh_274:Raksh274@cluster0.k16qr7w.mongodb.net/?appName=Cluster0/raksh_274";

app.use(cors());
app.use(express.json({ limit: '5mb' })); // For base64 avatars

import staffRoutes from './routes/staffRoutes';
import studentRoutes from './routes/studentRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentRoutes);

// Database connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Seed initial demo users if DB is empty
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding demo users...');
      const hashPwd = async (pwd: string) => await bcrypt.hash(pwd, 10);
      await User.insertMany([
        { name: 'Admin User', email: 'admin@institution.edu', password: await hashPwd('admin123'), role: 'admin' },
        { name: 'Staff User', email: 'staff@institution.edu', password: await hashPwd('staff123'), role: 'staff' },
        { name: 'Management User', email: 'management@institution.edu', password: await hashPwd('manage123'), role: 'management' }
      ]);
      console.log('Demo users seeded successfully!');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export { app };
