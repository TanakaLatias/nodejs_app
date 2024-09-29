import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
const JWT_SECRET: string = process.env.JWT || 'dummy-jwt-secret';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('No token provided. - authenticate');
        return res.redirect('/auth/signin');
    }
    console.log(token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        if (!decoded) {
            return res.status(400).send({ status: 'error', error: 'Invalid token.' });
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).send({ status: 'error', error: 'User not found.' });
        }
        req.user = user;
        req.decoded = decoded;
        next();
    } catch (error) {
        return res.status(500).send({ status: 'error - authenticate', error: error });
    }
};

export const notAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        if (!decoded) {
            return res.status(400).send({ status: 'error', error: 'Invalid token.' });
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).send({ status: 'error', error: 'User not found.' });
        }
        return res.redirect('/mypage');
    } catch (error) {
        return res.status(500).send({ status: 'error - notAuthenticated', error: error });
    }
};