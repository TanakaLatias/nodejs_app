import mongoose from 'mongoose';

export interface IReservation extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    reservationDate: Date;
    shop: 'Shinjuku' | 'Shibuya';
    paid: boolean;
};

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reservationDate: { type: Date, required: true },
    shop: { type: String, required: true, enum: ['Shinjuku', 'Shibuya'] },
    paid: { type: Boolean, default: false }
}, { timestamps: true });

const Reservation = mongoose.model<IReservation>("Reservation", reservationSchema);

export default Reservation;