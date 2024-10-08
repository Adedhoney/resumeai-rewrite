import { generateRandomId } from '@application/Utils';
import { ActivityTypes, IUploadedResume, IUser } from '@module/Domain/Model';
import {
    IActivityRepository,
    IResumeRepository,
} from '@module/Domain/Repository';
import { readFileSync, unlink } from 'fs';
import pdf from 'pdf-parse';

export interface IResumeService {
    UploadResume(file: Express.Multer.File, authData: IUser): Promise<string>;
    GetResume(resumeId: string): Promise<IUploadedResume>;
    GetUserResumes(userId: string): Promise<IUploadedResume[]>;
}

export class ResumeService implements IResumeService {
    constructor(
        private resumerepo: IResumeRepository,
        private activityrepo: IActivityRepository,
    ) {
        this.resumerepo = resumerepo;
        this.activityrepo = activityrepo;
    }
    async UploadResume(
        file: Express.Multer.File,
        authData: IUser,
    ): Promise<string> {
        const filePath = `${__dirname}/../../../uploadedFiles/${file.filename}`;
        const dataBuffer = readFileSync(filePath);

        const data = await pdf(dataBuffer);
        const resumeText = data.text;
        const resumeId = generateRandomId();
        const resume = {
            userId: authData.userId,
            resumeId,
            resumeText,
            resumeName: file.originalname,
        };
        await this.resumerepo.saveResume(resume);
        unlink(filePath, (error) => {
            if (error) throw error;
        });

        // save activity
        this.activityrepo.saveActivityLog({
            userId: authData.userId,
            activity: ActivityTypes.RESUME,
            description: `Uploaded Resume`,
        });
        return resumeId;
    }

    async GetUserResumes(userId: string): Promise<IUploadedResume[]> {
        const resumes = await this.resumerepo.getUserResumes(userId);
        return resumes;
    }

    async GetResume(resumeId: string): Promise<IUploadedResume> {
        const resumes = await this.resumerepo.getResume(resumeId);
        return resumes;
    }
}
