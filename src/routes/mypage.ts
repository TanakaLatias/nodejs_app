import express, { Request, Response } from 'express';
const router = express.Router();
import { mypage, updateUser, deleteUser, signout } from '../controllers/mypage';

// ユーザ情報表示
router.get('/', (req: Request, res: Response) => {
    return mypage(req, res);
});

// ユーザ名アップデート
router.get('/update', (req: Request, res: Response) => {
    return res.render('update');
});
router.post('/update', (req: Request, res: Response) => {
    return updateUser(req, res);
});

// ユーザデリート
router.get('/delete', (req: Request, res: Response) => {
    return res.render('deleteUser');
});
router.post('/delete', (req: Request, res: Response) => {
    return deleteUser(req, res);
});

// サインアウト
router.get('/signout', signout);

export default router;