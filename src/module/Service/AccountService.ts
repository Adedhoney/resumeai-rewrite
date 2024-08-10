import { CustomError } from '@application/Error/Error';
import {
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateOtpToken,
    generateRandomId,
    generateRandomOTP,
    getCurrentTimeStamp,
    StatusCode,
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
    GoogleUserDTO,
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
import axios from 'axios';

export interface IAccountService {
    ManualSignUp(data: ManualSignUpDTO): Promise<void>;
    GoogleSignIn(
        token: GoogleSignInDTO,
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

        const user: IUser = {
            userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password,
            emailVerified: false,
            filledPersonalInfo: false,
        };
        if (data.middleName) {
            user.middleName = data.middleName;
        }
        await this.acctrepo.saveUser(user);
        // send verifaication email
        const otp = generateRandomOTP();
        await this.acctrepo.saveOTP({
            email: data.email,
            otp,
            expiresAt: `${Date.now() / 1000 + 1200}`,
        });
        await this.acctnotif.confirmMail(data.email, otp, data.firstName);
    }

    async GoogleSignIn(data: GoogleSignInDTO): Promise<loginPayload> {
        // validate google authentication
        const { data: userData }: { data: GoogleUserDTO } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    Accept: 'application/json',
                },
            },
        );

        const emailExists = await this.acctrepo.getUserByEmail(userData.email);

        if (emailExists) {
            const token = generateAuthToken(
                emailExists.userId,
                emailExists.email,
            );

            delete emailExists.password;
            return { token, user: emailExists };
        }
        console.log(userData);

        if (!userData.verified_email) {
            throw new CustomError('Unauthorized', StatusCode.UNAUTHORIZED);
        }

        const userId = generateRandomId();
        const user = {
            userId,
            email: userData.email,
            firstName: userData.given_name,
            lastName: userData.family_name,
            emailVerified: userData.verified_email,
            filledPersonalInfo: false,
        };
        await this.acctrepo.saveUser(user);

        const token = generateAuthToken(user.userId, user.email);

        return { token, user: await this.acctrepo.getUserById(userId) };
    }

    async LogIn(data: ManualLogInDTO): Promise<loginPayload | void> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        if (!user) {
            throw new CustomError('Account not found', 400);
        }
        const validPassword = await decryptPassword(
            data.password as string,
            user.password as string,
        );
        if (!validPassword) {
            throw new CustomError('Invalid username or password', 400);
        }
        if (!user.emailVerified) {
            const otp = generateRandomOTP();
            await this.acctrepo.saveOTP({
                email: data.email,
                otp,
                expiresAt: `${Date.now() / 1000 + 1200}`,
            });
            await this.acctnotif.confirmMail(data.email, otp, user.firstName);
            throw new CustomError(
                'Email not verified. Verification email has been sent to your email',
            );
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
            expiresAt: `${Date.now() / 1000 + 1200}`,
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
        const { email } = verifyOtpToken(data.otpToken);
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

            // Praise's skill recorrection, will remove once he integrates with the other one

            for (let info of skills) {
                if (typeof info === 'string') {
                    const skillName = String(info);
                    const skill = { skill: skillName, userId, yearsOfExp: 1 };
                    skillsData.push(skill);
                    continue;
                }
                const skill = { ...info, userId };
                skillsData.push(skill);
                console.log('not string');
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
