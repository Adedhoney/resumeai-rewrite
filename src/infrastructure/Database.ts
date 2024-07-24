import config from '@application/Config/config';
import {
    CoverLetter,
    Skill,
    UploadedResume,
    User,
    WorkExperience,
    OTP,
    Education,
} from '@module/Domain/Model';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';

// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

export interface IDatabase {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    coverLetter: typeof CoverLetter;
    education: typeof Education;
    otp: typeof OTP;
    skill: typeof Skill;
    uploadedResume: typeof UploadedResume;
    user: typeof User;
    workExp: typeof WorkExperience;
}

const files = fs.readdirSync('src/module/Domain/Model').filter((file) => {
    return (
        file.indexOf('.') !== 0 &&
        file !== 'index.ts' &&
        file.slice(-3) === '.ts' &&
        file.indexOf('.test.ts') === -1
    );
});

const models = [
    CoverLetter,
    Skill,
    UploadedResume,
    User,
    WorkExperience,
    OTP,
    Education,
];

let sequelize = new Sequelize({
    database: config.DATABASE.database,
    dialect: config.DATABASE.dialect,
    username: config.DATABASE.username,
    password: config.DATABASE.password,
    storage: ':memory:',
    models,
});

let Database = {
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

export default Database as IDatabase;

let test = Database;
test.user.create;
