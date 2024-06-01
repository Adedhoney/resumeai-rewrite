import { IBaseRequest } from '@application/Request/Request';
import { GenerateCoverDTO } from '@module/Domain/DTO';
import { ICoverService } from '@module/Service';
import { NextFunction, RequestHandler, Response } from 'express';

export class CoverController {
    constructor(private service: ICoverService) {
        this.service = service;
    }
    generateCovert: RequestHandler = async (
        req: IBaseRequest<GenerateCoverDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        // try {
        //     await this.service.GenerateCover(req.body.data, req.locals.auser.);
        //     return successResponse(res, 'Successful');
        // } catch (err) {
        //     next(err);
        // }
    };
}
