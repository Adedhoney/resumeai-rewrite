import { IDatabase } from '@infrastructure/Database';
import { IActivityLog } from '../Model';

interface ActivityFilters {
    name?: string;
    userId?: string;
}

export interface IActivityRepository {
    readonly database: IDatabase;
    saveActivityLog(activityLog: IActivityLog): Promise<void>;
    getActivities(filters: ActivityFilters): Promise<IActivityLog[]>;
}

export class ActivityRepository implements IActivityRepository {
    constructor(readonly database: IDatabase) {
        this.database = database;
    }

    async saveActivityLog(activityLog: IActivityLog): Promise<void> {
        await this.database.activityLog.create({ ...activityLog });
    }

    async getActivities(filters: ActivityFilters): Promise<IActivityLog[]> {
        const activities = await this.database.activityLog.findAll({
            where: { ...filters },
        });
        return activities as IActivityLog[];
    }
}
