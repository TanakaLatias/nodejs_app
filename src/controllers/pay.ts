import { Request, Response } from 'express';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE as string, { apiVersion: '2024-06-20' });
import Reservation from '../models/reservation';

export const createCheckoutSession = async (req: Request, res: Response, rsvId: string) => {

    try {
        const rsv = await Reservation.findOne({
            _id: rsvId,
            userId: req.user?._id
        });
        if (!rsv) {
            return res.status(400).send({ status: 'error', error: '予約が見つかりませんでした。' });
        }
        if (rsv.paid) {
            return res.status(400).send({ status: 'error', error: 'この予約は既に支払われています。' });
        }
    } catch(error) {
        return res.status(500).send({ status: 'error - createCheckoutSession - reservation checking phase', error: error });
    }

    try {
        const prices = await stripe.prices.list();
        console.log(prices);
        const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: prices.data[0].id,
            quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:${process.env.PORT}/result/success?session_id={CHECKOUT_SESSION_ID}&rsv_id=${rsvId}`,
        cancel_url: `http://localhost:${process.env.PORT}/result/cancel`,
        });
        console.log(session);
        if (session.url) {
            res.redirect(303, session.url);
        }
    } catch (error) {
        return res.status(500).send({ status: 'error - createCheckoutSession - payment phase', error: error });
    }

};

export const findRsv = async (req: Request, res: Response, rsvId: string) => {
    try {
        const rsv = await Reservation.findOne({
            _id: rsvId,
            userId: req.user?._id
        });
        if (!rsv) {
            return res.status(400).send({ status: 'error', error: '予約が見つかりませんでした。' });
        }
        if (rsv.paid) {
            return res.status(400).send({ status: 'error', error: 'この予約は既に支払われています。' });
        }
        console.log(rsv._id, rsv.userId, rsv.reservationDate, rsv.shop, rsv.paid);
        return { userId: rsv.userId, reservationDate: rsv.reservationDate, shop: rsv.shop, paid: rsv.paid };
    } catch (error) {
        return res.status(500).send({ status: 'error - findRsv', error: error });
    }
};