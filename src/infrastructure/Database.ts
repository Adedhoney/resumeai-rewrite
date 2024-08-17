import config from '@application/Config/config';
import {
    ActivityLog,
    CoverLetter,
    Skill,
    UploadedResume,
    User,
    WorkExperience,
    OTP,
    Education,
} from '@module/Domain/Model';
import { Sequelize } from 'sequelize-typescript';

export interface IDatabase {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    activityLog: typeof ActivityLog;
    coverLetter: typeof CoverLetter;
    education: typeof Education;
    otp: typeof OTP;
    skill: typeof Skill;
    uploadedResume: typeof UploadedResume;
    user: typeof User;
    workExp: typeof WorkExperience;
}

const models = [
    ActivityLog,
    CoverLetter,
    Skill,
    UploadedResume,
    User,
    WorkExperience,
    OTP,
    Education,
];

const sequelize = new Sequelize({
    database: config.DATABASE.database,
    dialect: config.DATABASE.dialect,
    username: config.DATABASE.username,
    password:
        config.ENVIRONMENT === 'local_development'
            ? undefined
            : config.DATABASE.password,
    storage: ':memory:',
    models,
});

const Database: IDatabase = {
    activityLog: ActivityLog,
    coverLetter: CoverLetter,
    education: Education,
    otp: OTP,
    skill: Skill,
    uploadedResume: UploadedResume,
    user: User,
    workExp: WorkExperience,
    sequelize,
    Sequelize: Sequelize,
};

export default Database;
