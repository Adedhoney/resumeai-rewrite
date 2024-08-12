// import { getFileRootDir } from '@application/Utils';
import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

const envs = [
    'DB_HOST',
    'DB_PASSWORD',
    'DB_PORT',
    'DB_USERNAME',
    'DB_NAME',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'LEMON_SQUEEZY_KEY',
    'LEMON_SQUEEZY_SIGNATURE',
    'GPT_PDF_PROMPT',
    'GPT_COVER_LETTER_BEGIN_PROMPT',
    'GPT_COVER_LETTER_END_PROMPT',
    'SMTP_HOST',
    'AUTH_EMAIL',
    'AUTH_EMAIL_PASSWORD',
];

envs.forEach((value, index) => {
    if (!process.env[envs[index]]) {
        const message = 'Fatal Error: env ' + envs[index] + ' not defined';

        throw new Error(message);
    }
});

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    DATABASE: {
        port: Number(process.env.DB_PORT) || 3306,
        host: process.env.DB_HOST as string,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        dialect: 'mysql' as Dialect,
    },
    TOKEN_KEYS: {
        JWT_SECRET: process.env.JWT_SECRET,
        OPEN_AI: process.env.OPENAI_API_KEY,
        LEMON_SQUEEZY: process.env.LEMON_SQUEEZY_KEY,
        LEMON_SQUEEZY_SIGNATURE: process.env.LEMON_SQUEEZY_SIGNATURE,
    },
    SMTP: {
        HOST: process.env.SMTP_HOST,
        EMAIL: process.env.AUTH_EMAIL,
        PASSWORD: process.env.AUTH_EMAIL_PASSWORD,
    },
    PROMPTS: {
        BEGIN: process.env.GPT_COVER_LETTER_BEGIN_PROMPT,
        CONCLUSION: process.env.GPT_COVER_LETTER_END_PROMPT,
        PDFUPLOAD: process.env.GPT_PDF_PROMPT,
    },
};
