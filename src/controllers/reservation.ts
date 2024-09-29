import { Request, Response } from 'express';
import Reservation from '../models/reservation';

export const createReservation = async (req: Request, res: Response, shop: string, date: string) => {
    if (!date || !shop) {
        return res.status(400).send({ status: 'error', error: '日付、店名のどれかが入力されていません。' });
    }

    const rsvDate = new Date(date);
    const today = new Date();
    if (rsvDate < today) {
        return res.status(400).send({ status: 'error', error: '日付が本日よりも過去です。' });
    }

    const rsv = await Reservation.find({
        shop,
        reservationDate: {
            $gte: new Date(date),
            $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
    });

    if (rsv.length > 0) {
        return res.status(400).send({ status: 'error', error: '予約が埋まっています。' });
    }

    try {
        const reservation = await Reservation.create({
            userId: req.user?._id,
            reservationDate: date,
            shop: shop
        });
        console.log('予約が完了しました。: ', reservation);
        return res.redirect('/mypage');
    } catch (error) {
        return res.send({ status: 'error - createReservation', error: error});
    }
};

export const deleteReservation = async (req: Request, res: Response, rsvId: string) => {
    if (!rsvId) {
        return res.status(400).send({ status: 'error', error: '予約IDが入力されていません。' });
    }

    try {
        const deletedReservation = await Reservation.findOneAndDelete({
            _id: rsvId,
            userId: req.user?._id
        });
        if (!deletedReservation) {
            console.log('予約が見つからなかったか、予約を削除する権利がありません。');
            return res.redirect('/mypage');
        }
        console.log('予約が削除されました。');
        return res.redirect('/mypage');
    } catch (error) {
        return res.status(500).send({ status: 'error - deleteReservation', error: error });
    }
};