import { CustomError } from '@application/Error/Error';
import {
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateOtpToken,
    generateRandomId,
    generateRandomOTP,
    getCurrentTimeStamp,
    verifyOtpToken,
} from '@application/Utils';
import {
    ContactUsDTO,
    FeedbackDTO,
    LogInDTO,
    ResetPasswordDTO,
    SignUpDTO,
    SignUpType,
    VerifyOtpDTO,
} from '@module/Domain/DTO';
import { IUser, User } from '@module/Domain/Model';
import { IAccountRepository } from '@module/Domain/Repository/AccountRepository';
import { IAccountNotification } from '@module/Infrastructure/Notification';

export interface IAccountService {
    SignUp(data: SignUpDTO): Promise<void | { token: string; user: IUser }>;
    LogIn(data: LogInDTO): Promise<{ token: string; user: IUser } | void>;
    VerifyEmail(data: VerifyOtpDTO): Promise<{ token: string; user: IUser }>;
    GetUser(userId: string): Promise<IUser>;
    GiveFeedback(data: FeedbackDTO, authData: IUser): Promise<void>;
    ContactUs(data: ContactUsDTO): Promise<void>;
    // UpdateInfo(data: UpdateInfoDTO, userId: string): Promise<User>;
    // UpdatePassword(data: UpdatePassWordDTO, userId: string): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}

export class AccountService implements IAccountService {
    constructor(
        private acctrepo: IAccountRepository,
        private acctnotif: IAccountNotification,
    ) {
        this.acctrepo = acctrepo;
        this.acctnotif = acctnotif;
    }

    async SignUp(
        data: SignUpDTO,
    ): Promise<void | { token: string; user: IUser }> {
        const emailExists = await this.acctrepo.getUserByEmail(data.email);

        if (data.signUpType === SignUpType.MANUAL) {
            if (emailExists) {
                throw new CustomError(
                    'Account already exists, Log in instead.',
                );
            }
            const password = await encryptPassword(data.password);
            const userId = generateRandomId();

            const user = {
                userId,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password,
                emailverified: false,
                filledPersonalInfo: false,
            };
            await this.acctrepo.saveUser(user);
            // send verifaication email
            const otp = generateRandomOTP();
            await this.acctrepo.saveOTP({
                email: data.email,
                otp,
                expiresAt: `${Date.now() + 1200000}`,
            });
            await this.acctnotif.confirmMail(data.email, otp, data.firstName);
        } else if (data.signUpType === SignUpType.GOOGLE) {
            if (emailExists) {
                const login = await this.LogIn({
                    email: data.email,
                    signInType: data.signUpType,
                });
                return login;
            }

            const userId = generateRandomId();
            const user = {
                userId,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                emailverified: true,
                filledPersonalInfo: false,
            };
            await this.acctrepo.saveUser(user);

            const login = await this.LogIn({
                email: data.email,
                signInType: data.signUpType,
            });
            return login;
        }
    }

    async LogIn(
        data: LogInDTO,
    ): Promise<{ token: string; user: IUser } | void> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        if (!user) {
            throw new CustomError('Account not found');
        }
        if (data.signInType === SignUpType.GOOGLE) {
            const token = generateAuthToken(user.userId, user.email);

            delete user.password;
            return { token, user };
        }
        const validPassword = await decryptPassword(
            data.password as string,
            user.password as string,
        );
        if (!validPassword) {
            throw new CustomError('Invalid username or password');
        }
        if (!user.emailVerified) {
            const otp = generateRandomOTP();
            await this.acctrepo.saveOTP({
                email: data.email,
                otp,
                expiresAt: getCurrentTimeStamp(),
            });
            await this.acctnotif.confirmMail(data.email, otp, user.firstName);
            return;
        }
        const token = generateAuthToken(user.userId, user.email);

        delete user.password;

        return { token, user };
    }

    async VerifyEmail(
        data: VerifyOtpDTO,
    ): Promise<{ token: string; user: IUser }> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        const verified = await this.acctrepo.getOTP(data.email, data.otp);
        if (!verified || verified.expiresAt < getCurrentTimeStamp()) {
            throw new CustomError('Invalid OTP or expired');
        }
        await this.acctrepo.verifyEmail(data.email);

        const token = generateAuthToken(user.userId, user.email);

        delete user.password;

        return { token, user };
    }

    async GetUser(userId: string): Promise<IUser> {
        const user = await this.acctrepo.getUserById(userId);
        delete user.password;

        return user;
    }

    async ForgotPassword(email: string): Promise<void> {
        const user = await this.acctrepo.getUserByEmail(email);
        if (!user) {
            throw new CustomError(
                'Not account is associated with this email address',
            );
        }
        const otp = generateRandomOTP();
        await this.acctrepo.saveOTP({
            email: email,
            otp,
            expiresAt: getCurrentTimeStamp(),
        });
        await this.acctnotif.forgotPasswordEmail(email, otp, user.firstName);
    }

    async VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }> {
        const savedOtp = await this.acctrepo.getOTP(data.email, data.otp);
        const date = getCurrentTimeStamp();
        if (!savedOtp || date > savedOtp.expiresAt)
            throw new CustomError('Invalid OTP or expired');

        const token = generateOtpToken(data.email);
        return { token };
    }

    async ResetPassword(data: ResetPasswordDTO): Promise<void> {
        const { email } = verifyOtpToken(data.token);
        if (!email) {
            throw new CustomError('Token invalid or expired');
        }
        const password = await encryptPassword(data.newPassword);
        const user = await this.acctrepo.getUserByEmail(email);

        if (!user) {
            throw new CustomError('User not found', 400);
        }
        await this.acctrepo.updatePassword(user.userId, password);
    }

    async GiveFeedback(data: FeedbackDTO, authData: IUser): Promise<void> {
        await this.acctnotif.feedbackEmail(
            authData.email,
            authData.firstName,
            data.feedback,
        );
    }

    async ContactUs(data: ContactUsDTO): Promise<void> {
        await this.acctnotif.ContactUsMail(data.email, data.name, data.message);
    }
}
