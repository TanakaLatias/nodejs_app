import { Request, Response } from 'express';
import Reservation from '../models/reservation';
import User from '../models/user';

export const mypage = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const reservations = await Reservation.find({ userId }).sort({ reservationDate: -1 });
        return res.render('mypage', { user: req.user, reservations: reservations });
    } catch (error) {
        return res.status(500).send({ status: 'error - mypage', error: error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    const updatedData: { username?: string; } = {};
    if (username) updatedData.username = username;
    try {
        const user = await User.findByIdAndUpdate(req.user?._id, updatedData, { new: true });
        console.log('ユーザ情報が更新されました。: ', user);
        return res.redirect('/mypage');
    } catch (error) {
        return res.status(500).send({ status: 'error - updateUser', error: error });
    }
    
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.user?._id);
        console.log('ユーザ情報が削除されました。');
        return res.redirect('/');
    } catch (error) {
        return res.status(500).send({ status: 'error - deleteUser', error: error });
    }
};

export const signout = (req: Request, res: Response) => {
    res.clearCookie('token');
    console.log('ユーザがサインアウトしました。');
    return res.redirect('/');
};