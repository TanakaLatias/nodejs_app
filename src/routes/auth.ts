import express, { Request, Response } from 'express';
const router = express.Router();
import { signup, signin, verify } from '../controllers/auth';

// サインアップ
router.get('/signup', (req: Request, res: Response) => {
    res.render('signup');
});
router.post('/signup', signup);

// サインイン
router.get('/signin', (req: Request, res: Response) => {
    res.render('signin');
});
router.post('/signin', signin);

// Emailでアカウント認証する（Emailに記載のURLのリクエスト先）
router.get('/verify/:userId/:uuid', (req: Request, res: Response) => {
    const userId = req.params.userId;
    const uuid = req.params.uuid;
    return verify(req, res, userId, uuid);
});

export default router;