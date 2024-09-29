import mongoose, { Document } from 'mongoose';

export interface IToken extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    token: string;
    userId: string;
}

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: String, required: true }
}, { timestamps: true });

const Token = mongoose.model<IToken>('Token', tokenSchema);
export default Token;