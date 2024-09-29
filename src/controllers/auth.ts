import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from "uuid";
import User from '../models/user';
import Token from '../models/token';
import { sendMail } from './sendMail';
const JWT_SECRET: string = process.env.JWT || 'dummy-jwt-secret';

export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({ status: 'error', error: 'ユーザネーム、Email、パスワードのどれかが入力されていません。' });
    }
    const user = await User.findOne({ email });
    if(user){
        return res.status(400).send({ status: 'error', error: 'このEmailは既に利用されています。' });
    }
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ email: email, password: hashed, username: username, isVerified: false });
        console.log(user);
        // トークンを作成してEmail認証する。
        const uuid = uuidv4();
        const token = await Token.create({ token: uuid, userId: user._id });
        sendMail(email, username, user._id.toString(), uuid);
        console.log("user: ", user, "token: ", token);
        return res.render('emailSent', { email: email });
    } catch (error) {
        return res.send({ status: 'error - signup', error: error});
    }
};

export const verify = async (req: Request, res: Response, userId: string, uuid: string) => {
    const token = await Token.findOne({ token: uuid, userId: userId });
    if(!token){
        return res.status(400).send({ status: 'error', error: 'Email認証のURLが不正です。' });
    };
    const user = await User.findOne({ _id: userId });
    const isVerified = user?.isVerified;
    if(isVerified){
        return res.status(400).send({ status: 'error', error: 'ユーザは既にEmail認証されています。' });
    };
    await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    const verifiedUser = await User.findOne({ _id: userId });
    console.log("verified user: ", verifiedUser);
    return res.redirect('/mypage');
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Email、パスワードのどれかが入力されていません。' });
    };
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).send({ status: 'error', error: 'ユーザがサインアップしていません。' });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).send({ status: 'error', error: 'パスワードが不正です。' });
    }
    try {
        const token = jwt.sign({ username:user.username, email: user.email, type:'user'}, JWT_SECRET, { expiresIn: '24h'});
        res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' });
        console.log('Successfully signed in.');
        return res.redirect('/mypage');
    } catch (error) {
        return res.send({ status: 'error - signin', error: error});
    }
};