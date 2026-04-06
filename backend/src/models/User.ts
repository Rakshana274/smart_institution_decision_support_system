import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff' | 'management';
  avatar?: string;
  profileData?: {
    dob?: string;
    gender?: string;
    country?: string;
    timezone?: string;
    pincode?: string;
    programmingLanguage?: string;
    programmingSince?: string;
    highestDegree?: string;
    profession?: string;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'management'], required: true, index: true },
  avatar: { type: String },
  profileData: {
    dob: String,
    gender: String,
    country: String,
    timezone: String,
    pincode: String,
    programmingLanguage: String,
    programmingSince: String,
    highestDegree: String,
    profession: String,
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
