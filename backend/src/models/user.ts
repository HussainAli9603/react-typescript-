import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  createdAt: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the model and return the IUser interface
export default mongoose.model<IUser>('User', UserSchema);
