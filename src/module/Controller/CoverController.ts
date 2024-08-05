import { IBaseRequest } from '@application/Request/Request';
import { successResponse } from '@application/Utils';
import { GenerateCoverDTO } from '@module/Domain/DTO';
import { ICoverService } from '@module/Service';
import { NextFunction, RequestHandler, Response, Request } from 'express';

export class CoverController {
    constructor(private service: ICoverService) {
        this.service = service;
    }
    generateCover: RequestHandler = async (
        req: IBaseRequest<GenerateCoverDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const cover = await this.service.GenerateCover(
                req.body.data,
                res.locals.authData.userId,
            );
            return successResponse(res, 'Successful', cover);
        } catch (err) {
            next(err);
        }
    };

    getCover: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const cover = await this.service.GetCover(req.params.coverId);
            return successResponse(res, 'Covers', cover);
        } catch (err) {
            next(err);
        }
    };

    getUserCovers: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const covers = await this.service.GetUserCovers(
                res.locals.authData.userId,
            );
            return successResponse(res, 'Covers', covers);
        } catch (err) {
            next(err);
        }
    };
}
