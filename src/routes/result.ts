import express, { Request, Response } from 'express';
const router = express.Router();
import { success } from '../controllers/result';
import { authenticate } from '../middlewares/auth';

// 支払い成功
router.get('/success', (req: Request, res: Response) => {
    const sessionId = req.query.session_id as string;
    const rsvId = req.query.rsv_id as string;
    console.log(sessionId, rsvId);
    return success(req, res, sessionId, rsvId);
});

// 支払いキャンセル完了画面表示
router.get('/cancel', (req: Request, res: Response) => {
    res.render('cancel');
});

export default router;