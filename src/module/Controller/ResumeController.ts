import { IResumeService } from '@module/Service';
import { successResponse } from '@application/Utils';
import { NextFunction, RequestHandler, Response, Request } from 'express';

export class ResumeController {
    constructor(private service: IResumeService) {
        this.service = service;
    }

    uploadResume: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const resumeId = await this.service.UploadResume(
                req.file as Express.Multer.File,
                res.locals.authData,
            );
            return successResponse(res, 'Successful', { resumeId });
        } catch (err) {
            next(err);
        }
    };

    getResume: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const resume = await this.service.GetResume(req.params.resumeId);
            return successResponse(res, 'Resume', resume);
        } catch (err) {
            next(err);
        }
    };

    getUserResumes: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const resumes = await this.service.GetUserResumes(
                res.locals.authData.userId,
            );
            return successResponse(res, 'Resumes', resumes);
        } catch (err) {
            next(err);
        }
    };
}
