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
    ManualLogInDTO,
    ResetPasswordDTO,
    ManualSignUpDTO,
    GoogleSignInDTO,
    VerifyOtpDTO,
    loginPayload,
    SaveProfessionalInfoDTO,
} from '@module/Domain/DTO';
import {
    IEducation,
    ISkill,
    IUser,
    IWorkExperience,
} from '@module/Domain/Model';
import {
    IAccountRepository,
    ISaveProfessionalInfo,
} from '@module/Domain/Repository/AccountRepository';
import { IAccountNotification } from '@module/Infrastructure/Notification';

export interface IAccountService {
    ManualSignUp(data: ManualSignUpDTO): Promise<void>;
    GoogleSignIn(
        data: GoogleSignInDTO,
    ): Promise<{ token: string; user: IUser }>;
    LogIn(data: ManualLogInDTO): Promise<{ token: string; user: IUser } | void>;
    VerifyEmail(data: VerifyOtpDTO): Promise<{ token: string; user: IUser }>;
    GetUser(userId: string): Promise<{ user: IUser; dashboardInfo: any }>;
    GiveFeedback(data: FeedbackDTO, authData: IUser): Promise<void>;
    ContactUs(data: ContactUsDTO): Promise<void>;
    SetProfessionalInfo(
        data: SaveProfessionalInfoDTO,
        userId: string,
    ): Promise<void>;
    GetProfessionalInfo(userId: string): Promise<IUser>;
    // UpgradetoPremium(data: UpdateInfoDTO, userId: string): Promise<User>;
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

    async ManualSignUp(data: ManualSignUpDTO): Promise<void> {
        const emailExists = await this.acctrepo.getUserByEmail(data.email);

        if (emailExists) {
            throw new CustomError('Account already exists, Log in instead.');
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
    }

    async GoogleSignIn(data: GoogleSignInDTO): Promise<loginPayload> {
        const emailExists = await this.acctrepo.getUserByEmail(data.email);

        // validate google authentication

        if (emailExists) {
            const token = generateAuthToken(
                emailExists.userId,
                emailExists.email,
            );

            delete emailExists.password;
            return { token, user: emailExists };
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

        const token = generateAuthToken(user.userId, user.email);

        return { token, user };
    }

    async LogIn(data: ManualLogInDTO): Promise<loginPayload | void> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        if (!user) {
            throw new CustomError('Account not found');
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

    async GetUser(
        userId: string,
    ): Promise<{ user: IUser; dashboardInfo: any }> {
        const user = await this.acctrepo.getUserById(userId);
        const dashboardInfo = await this.acctrepo.getUserDashboard(userId);
        delete user.password;

        return { user, dashboardInfo };
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

    async SetProfessionalInfo(
        data: SaveProfessionalInfoDTO,
        userId: string,
    ): Promise<void> {
        const { education, skills, workExp } = data;
        if (!education && !skills && !workExp) {
            throw new CustomError(
                'Provide values for either skills, work experience or education',
            );
        }
        const repoData: ISaveProfessionalInfo = {};
        if (education) {
            const edus: IEducation[] = [];
            for (let info of education) {
                const educationId = generateRandomId();
                const edu = { ...info, educationId, userId };
                edus.push(edu);
            }
            repoData.education = edus;
        }
        if (workExp) {
            const workExperience: IWorkExperience[] = [];
            for (let info of workExp) {
                const experienceId = generateRandomId();
                const exp = { ...info, experienceId, userId };
                workExperience.push(exp);
            }
            repoData.workExp = workExperience;
        }
        if (skills) {
            const skillsData: ISkill[] = [];
            for (let info of skills) {
                const skill = { ...info, userId };
                skillsData.push(skill);
            }
            repoData.skills = skillsData;
        }

        await this.acctrepo.saveProfessionalInfo(repoData);
    }
    async GetProfessionalInfo(userId: string): Promise<IUser> {
        const user = await this.acctrepo.getProfessionalInfo(userId);
        return user;
    }
}
