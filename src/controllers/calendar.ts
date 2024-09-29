import e, { Request, Response } from 'express';
import Reservation from '../models/reservation';

interface Reservations {
    [key: string]: { [key: string]: string };
};

export const checkCalendar = async (req: Request, res: Response) => {
    // ↓ このrsvDateに{"店名": {"日付": "空きあり", "日付": "空きなし"}, "店名":...}のようなカレンダーデータを入れる
    const rsvDate: Reservations = {};
    var rsvnum = 0;
    const shops = ['Shinjuku', 'Shibuya'].sort();
    for (const shop of shops) {
        rsvDate[shop] = {};
    }

    try {
        // ↓ カレンダーで埋まっている部分を見つけるため、予約を全部取り出しておく。
        const rsvs = await Reservation.find().sort({ shop: 1, reservationDate: 1 });
        // ↓ ２重ループ。店ごとに、１日１枠、１０日で１０枠の予約枠を作る。予約が埋まっている部分は別の処理をする。
        for (let h=0; h < shops.length; h++) {
            for (let i = 0; i < 10; i++) {

                // ↓ 日付
                const date = new Date();
                date.setUTCHours(0, 0, 0, 0);
                date.setDate(date.getDate() + i);
                const dateISO = date.toISOString();

                // ↓ 予約が無い際のインデックスエラー回避用
                if (rsvnum>=rsvs.length) {
                    rsvnum--;
                };

                // 該当日付の予約があるかどうか
                var rsv = null;
                if (rsvs.length!=0) {
                    rsv = rsvs[rsvnum].reservationDate.toISOString() === dateISO && rsvs[rsvnum].shop === shops[h];
                }
                
                if (rsv) {
                    console.log("matched!");
                    rsvDate[shops[h]][dateISO] = "full";
                    rsvnum++;
                } else {
                    rsvDate[shops[h]][dateISO] = "empty";
                }
            }
        }
        console.log(rsvDate);
        return res.render('calendar', { rsvDate: rsvDate });
    } catch (error) {
        return res.send({ status: 'error - checkCalendar', error: error });
    }
};
