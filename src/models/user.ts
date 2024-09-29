import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    password: string;
    username: string;
    isVerified: boolean;
};

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);
export default User;
