import { Request, Response } from 'express';
import Reservation from '../models/reservation';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE as string, { apiVersion: '2024-06-20' });

export const success = async (req: Request, res: Response, sessionId: string, rsvId: string) => {
    console.log(sessionId, rsvId);

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            console.log("paid");
            const updatedData = { paid: true };
            const newRsv = await Reservation.findByIdAndUpdate( rsvId , updatedData, { new: true });
            console.log(newRsv);
            return res.render('paymentOk');
        } else {
            return res.status(400).send({ status: 'error - success', message: 'payment undone.' });
        }
    } catch (error) {
        return res.status(500).send({ status: 'error - success', message: 'payment info not found.', error });
    }

};