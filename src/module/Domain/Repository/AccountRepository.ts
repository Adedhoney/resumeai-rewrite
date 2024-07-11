import { IDatabase } from '@infrastructure/Database';
import { IEducation, IOTP, ISkill, IUser, IWorkExperience } from '../Model';
import { Optional } from 'sequelize';

export interface IAccountRepository {
    readonly database: IDatabase;
    saveUser(user: IUser): Promise<void>;
    getUserByEmail(email: string): Promise<IUser>;
    getUserById(userId: string): Promise<IUser>;
    getUserDashboard(userId: string): Promise<any>;
    updateUser(user: IUser): Promise<void>;
    updatePassword(userId: string, password: string): Promise<void>;
    verifyEmail(email: string): Promise<void>;
    saveProfessionalInfo(data: ISaveProfessionalInfo): Promise<void>;
    getProfessionalInfo(userId: string): Promise<IUser>;

    saveOTP(OTP: IOTP): Promise<void>;
    getOTP(email: string, otp: string): Promise<IOTP>;
}

export interface ISaveProfessionalInfo {
    skills?: ISkill[];
    workExp?: IWorkExperience[];
    education?: IEducation[];
}

export class AccountRepository implements IAccountRepository {
    constructor(readonly database: IDatabase) {
        this.database = database;
    }

    async saveUser(user: IUser): Promise<void> {
        await this.database.user.create({ ...user });
    }

    async getUserByEmail(email: string): Promise<IUser> {
        const user = await this.database.user.findOne({ where: { email } });
        return user?.dataValues as IUser;
    }

    async getUserById(userId: string): Promise<IUser> {
        const user = await this.database.user.findOne({ where: { userId } });
        return user?.dataValues as IUser;
    }

    async getUserDashboard(userId: string): Promise<any> {
        const coversCount = await this.database.coverLetter.count({
            where: {
                userId,
            },
        });
        const dashboard = { coversCount };
        return dashboard;
    }

    async verifyEmail(email: string): Promise<void> {
        await this.database.user.update(
            { emailVerified: true },
            { where: { email } },
        );
    }
    async getProfessionalInfo(userId: string): Promise<IUser> {
        const user = await this.database.user.findOne({
            where: { userId },
            include: [
                {
                    model: this.database.skill,
                    as: 'skills',
                },
                {
                    model: this.database.education,
                    as: 'education',
                },
                {
                    model: this.database.workExp,
                    as: 'workExperience',
                },
            ],
        });
        return user?.dataValues as IUser;
    }

    async saveProfessionalInfo(data: ISaveProfessionalInfo): Promise<void> {
        const transaction = await this.database.sequelize.transaction();

        try {
            if (data.skills) {
                const skills: Optional<
                    ISkill,
                    'id' | 'createdAt' | 'updatedAt'
                >[] = data.skills;
                await this.database.skill.bulkCreate(skills, {
                    fields: ['userId', 'skill', 'yearsOfExp'],
                    transaction,
                });
            }
            if (data.workExp) {
                const workExps: Optional<
                    IWorkExperience,
                    'id' | 'createdAt' | 'updatedAt'
                >[] = data.workExp;
                await this.database.workExp.bulkCreate(workExps, {
                    fields: [
                        'experienceId',
                        'userId',
                        'isCurrentWork',
                        'expType',
                        'employer',
                        'jobTitle',
                        'details',
                        'startDate',
                        'endDate',
                    ],
                    transaction,
                });
            }
            if (data.education) {
                const educations: Optional<
                    IEducation,
                    'id' | 'createdAt' | 'updatedAt'
                >[] = data.education;
                await this.database.education.bulkCreate(educations, {
                    fields: [
                        'educationId',
                        'userId',
                        'school',
                        'degree',
                        'fieldOfStudy',
                        'startDate',
                        'endDate',
                        'grade',
                        'activities',
                        'description',
                    ],
                    transaction,
                });
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error; // re-throw the error after rolling back the transaction
        }
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
