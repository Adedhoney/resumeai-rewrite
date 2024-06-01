import { IDatabase } from '@infrastructure/Database';
import Sequelize from 'sequelize';
import { ICoverLetter } from '../Model';

export interface ICoverRepository {
    readonly database: IDatabase;
    getCover(coverId: string): Promise<ICoverLetter>;
    getUserCovers(userId: string): Promise<ICoverLetter[]>;
    getDailyCoverCount(userId: string): Promise<number>;
    saveCover(cover: ICoverLetter): Promise<void>;
}

export class CoverRepository implements ICoverRepository {
    constructor(readonly database: IDatabase) {
        this.database = database;
    }

    async getCover(coverId: string): Promise<ICoverLetter> {
        const cover = await this.database.coverLetter.findOne({
            where: { coverId },
        });
        return cover as ICoverLetter;
    }
    async getDailyCoverCount(userId: string): Promise<number> {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const cover = await this.database.coverLetter.count({
            where: {
                userId,
                createdAt: {
                    [Sequelize.Op.between]: [todayStart, todayEnd],
                },
            },
        });
        return cover as number;
    }

    async getUserCovers(userId: string): Promise<ICoverLetter[]> {
        const covers = await this.database.coverLetter.findAll({
            where: { userId },
        });
        return covers as ICoverLetter[];
    }

    async saveCover(cover: ICoverLetter): Promise<void> {
        await this.database.coverLetter.create({ ...cover });
    }
}
