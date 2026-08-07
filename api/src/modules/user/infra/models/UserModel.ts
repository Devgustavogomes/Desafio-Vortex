import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document<string> {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
