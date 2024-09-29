import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
// 自作関数import
import { connectToDatabase } from './connect'; // mongoDB接続
import { authenticate, notAuthenticated } from './middlewares/auth'; // ログイン済みか、notログイン済みか
// routes系
import authRoutes from './routes/auth';
import mypageRoutes from './routes/mypage';
import calendarRoutes from './routes/calendar';
import reservationRoutes from './routes/reservation';
import payRoutes from './routes/pay';
import resultRoutes from './routes/result';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// routes系
app.use('/auth', notAuthenticated, authRoutes); // 会員登録
app.use('/mypage', authenticate, mypageRoutes); // マイページ
app.use('/calendar', calendarRoutes); // カレンダー
app.use('/reservation', authenticate, reservationRoutes); // 予約
app.use('/pay', authenticate, payRoutes); // 支払い
app.use('/result', resultRoutes); // 支払い結果

app.set('view engine', 'ejs');

connectToDatabase();

app.get('/', notAuthenticated, (req: Request, res: Response) => {
    return res.render('home');
});

app.listen(port, () => {
    console.log(`http://localhost:${port} のURLでサーバが稼働しています。`);
});