import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import { createCheckoutSession, findRsv } from '../controllers/pay';

// 予約データ型
interface RsvData {
    userId: mongoose.Schema.Types.ObjectId;
    reservationDate: Date;
    shop: 'Shinjuku' | 'Shibuya';
    paid: boolean;
}

// 支払いフォーム表示
router.get('/:rsvId', async (req: Request, res: Response) => {
    const rsvId = req.params.rsvId;
    const rsvData = await findRsv(req, res, rsvId) as RsvData;
    if (!rsvData) {
        return res.status(400).send({ status: 'error', message: '予約が見つからなかったか、既に支払われています。' });
    }
    const { userId, reservationDate, shop, paid } = rsvData as RsvData;
    return res.render('checkout', { "rsvId": rsvId, "userId": userId, "reservationDate": reservationDate, "shop": shop, "paid": paid });
});

// 支払い実行
router.post('/create-checkout-session/:rsvId', (req: Request, res: Response) => {
    const rsvId = req.params.rsvId;
    return createCheckoutSession(req, res, rsvId);
});

export default router;