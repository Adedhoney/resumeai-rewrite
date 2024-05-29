import { IDatabase } from '@infrastructure/Database';
import { IOTP, IUser } from '../Model';

export interface IAccountRepository {
    readonly database: IDatabase;
    saveUser(user: IUser): Promise<void>;
    getUserByEmail(email: string): Promise<IUser>;
    getUserById(userId: string): Promise<IUser>;
    // forgot password
    // verify otp
    // deleteUser(userId: string): Promise<void>;
    updateUser(user: IUser): Promise<void>;
    updatePassword(userId: string, password: string): Promise<void>;
    verifyEmail(email: string): Promise<void>;
    // reset password

    saveOTP(OTP: IOTP): Promise<void>;
    getOTP(email: string, otp: string): Promise<IOTP>;
}

export class AcccountRepository implements IAccountRepository {
    constructor(readonly database: IDatabase) {
        this.database = database;
    }

    async saveUser(user: IUser): Promise<void> {
        await this.database.user.create({ ...user });
    }

    async getUserByEmail(email: string): Promise<IUser> {
        const user = await this.database.user.findOne({ where: { email } });
        return user as IUser;
    }

    async getUserById(userId: string): Promise<IUser> {
        const user = await this.database.user.findOne({ where: { userId } });
        return user as IUser;
    }

    async verifyEmail(email: string): Promise<void> {
        await this.database.user.update(
            { emailVerified: true },
            { where: { email } },
        );
    }

    async saveOTP(OTP: IOTP): Promise<void> {
        await this.database.otp.upsert({ ...OTP });
    }

    async getOTP(email: string, otp: string): Promise<IOTP> {
        const otpInfo = await this.database.otp.findOne({
            where: { email, otp },
        });
        return otpInfo as IOTP;
    }

    async updateUser(user: IUser): Promise<void> {
        await this.database.user.update(
            { ...user },
            { where: { userId: user.userId } },
        );
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.database.user.update({ password }, { where: { userId } });
    }
}
