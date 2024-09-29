import express, { Request, Response } from 'express';
const router = express.Router();
import { checkCalendar } from '../controllers/calendar';

// 予約カレンダー表示
router.get('/', (req: Request, res: Response) => {
    return checkCalendar(req, res);
});

export default router;