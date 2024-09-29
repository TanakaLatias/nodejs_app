import express, { Request, Response } from 'express';
const router = express.Router();
import { createReservation } from '../controllers/reservation';
import { deleteReservation } from '../controllers/reservation';

// 予約確定フォーム表示
router.get('/create/:shop/:date', (req: Request, res: Response) => {
    const shop = req.params.shop;
    const date = req.params.date;
    res.render('confirm', { "shop": shop, "date": date});
});

// 予約作成
router.post('/create/:shop/:date', (req: Request, res: Response) => {
    const shop = req.params.shop;
    const date = req.params.date;
    return createReservation(req, res, shop, date);
});

// 予約削除フォーム表示
router.get('/delete/:rsvId', (req: Request, res: Response) => {
    const rsvId = req.params.rsvId;
    return res.render('deleteReservation', { rsvId: rsvId });
});

// 予約削除
router.post('/delete/:rsvId', (req: Request, res: Response) => {
    const rsvId = req.params.rsvId;
    return deleteReservation(req, res, rsvId);
});

export default router;