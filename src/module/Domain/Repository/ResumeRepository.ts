import { IDatabase } from '@infrastructure/Database';
import { IUploadedResume } from '../Model';

export interface IResumeRepository {
    readonly database: IDatabase;
    getResume(resumeId: string): Promise<IUploadedResume>;
    getUserResumes(userId: string): Promise<IUploadedResume[]>;
    saveResume(resume: IUploadedResume): Promise<void>;
}

export class ResumeRepository implements IResumeRepository {
    constructor(readonly database: IDatabase) {
        this.database = database;
    }

    async getResume(resumeId: string): Promise<IUploadedResume> {
        const resume = await this.database.uploadedResume.findOne({
            where: { resumeId },
        });
        return resume as IUploadedResume;
    }

    async getUserResumes(userId: string): Promise<IUploadedResume[]> {
        const resumes = await this.database.uploadedResume.findAll({
            where: { userId },
        });
        return resumes as IUploadedResume[];
    }

    async saveResume(resume: IUploadedResume): Promise<void> {
        await this.database.uploadedResume.create({ ...resume });
    }
}
