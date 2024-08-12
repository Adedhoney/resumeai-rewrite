import { CustomError } from '@application/Error/Error';
import { StatusCode, generateRandomId } from '@application/Utils';
import { GenerateCoverDTO, InfoType } from '@module/Domain/DTO';
import { ICoverLetter, IUser } from '@module/Domain/Model';
import { ICoverRepository, IResumeRepository } from '@module/Domain/Repository';
import { IOpenAI } from '@module/Infrastructure/OpenAI/openai';

export interface ICoverService {
    GenerateCover(
        data: GenerateCoverDTO,
        userId: string,
    ): Promise<ICoverLetter>;
    GetCover(coverId: string): Promise<ICoverLetter>;
    GetUserCovers(userId: string): Promise<ICoverLetter[]>;
}

export class CoverService implements ICoverService {
    constructor(
        private coverrepo: ICoverRepository,
        private resumerepo: IResumeRepository,
        private openaiservice: IOpenAI,
    ) {
        this.coverrepo = coverrepo;
        this.resumerepo = resumerepo;
        this.openaiservice = openaiservice;
    }

    async GenerateCover(
        data: GenerateCoverDTO,
        userId: string,
    ): Promise<ICoverLetter> {
        //Get number of covers

        // Will uncomment this below when we intergrate payment

        // const limit = await this.coverrepo.getDailyCoverCount(userId);
        // if (limit >= 3) {
        //     throw new CustomError(
        //         'Upgrade to Premium to get more access',
        //         StatusCode.UNAUTHORIZED,
        //     );
        // }

        let resumeInfo = '';
        if (data.infoType === InfoType.RESUME) {
            if (!data.resumeId) {
                throw new CustomError(
                    'When resume option is chosen, resumeId must be provided',
                    400,
                );
            }
            const resume = await this.resumerepo.getResume(
                data.resumeId as string,
            );
            resumeInfo = resume.resumeText;
        } else if (data.infoType === InfoType.MANUAL) {
            if (!data.manualInfo) {
                throw new CustomError(
                    'When manual option is chosen, manualInfo must be provided',
                    400,
                );
            }
            const info = JSON.stringify(data.manualInfo);
            resumeInfo = info;
        } else {
            throw new CustomError(
                `infoType must be equal to either to ${InfoType.MANUAL} or ${InfoType.RESUME}`,
                400,
            );
        }

        const coverLetter = await this.openaiservice.GenerateCover({
            ...data,
            resumeInfo,
        });
        const coverId = generateRandomId();
        const cover = {
            coverLetter,
            userId,
            employer: data.employer,
            jobTitle: data.jobTitle,
            coverId,
        };
        await this.coverrepo.saveCover(cover);
        return cover;
    }

    async GetCover(coverId: string): Promise<ICoverLetter> {
        const cover = await this.coverrepo.getCover(coverId);
        return cover;
    }

    async GetUserCovers(userId: string): Promise<ICoverLetter[]> {
        const covers = await this.coverrepo.getUserCovers(userId);
        return covers;
    }
}
