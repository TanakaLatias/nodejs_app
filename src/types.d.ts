import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './models/user';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            decoded?: JwtPayload;
        }
    }
}