import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  department: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  joinDate: string;
  rating: number;
}

const staffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  joinDate: { type: String, required: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

// Transform _id to id
staffSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete (ret as any)._id; }
});

export const Staff = mongoose.model<IStaff>('Staff', staffSchema);
