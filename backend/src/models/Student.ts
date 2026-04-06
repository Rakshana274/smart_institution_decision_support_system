import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  regNo: string;
  department: string;
  semester: number;
  cgpa: number;
  attendance: number;
  status: 'active' | 'at-risk';
  assignedStaffId?: mongoose.Types.ObjectId;
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  regNo: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  attendance: { type: Number, required: true },
  status: { type: String, enum: ['active', 'at-risk'], required: true },
  assignedStaffId: { type: Schema.Types.ObjectId, ref: 'Staff' }
}, { timestamps: true });

// Compound unique index so roll number uniqueness is per-department
studentSchema.index({ regNo: 1, department: 1 }, { unique: true });


// Transform _id to id
studentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete (ret as any)._id; }
});

export const Student = mongoose.model<IStudent>('Student', studentSchema);
