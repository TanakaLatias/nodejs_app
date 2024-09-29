import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (to: string, username: string, userId: string, token: string) => {

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "アカウント有効化",
        text: `
        ${username}さん、こんにちは!
        以下のリンクからアカウント登録を完了させてください。
        http://localhost:${process.env.PORT}/auth/verify/${userId}/${token}
        `,
    };

    try {
        const info = await mailTransporter.sendMail(mailOptions);
        console.log('メールが送信されました: ', info.response);
    } catch (error) {
        console.error('メール送信中にエラーが発生しました: ', error);
    }

};
