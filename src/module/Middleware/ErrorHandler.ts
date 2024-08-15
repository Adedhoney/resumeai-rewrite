import { BaseError } from '@application/Error/Error';
import { errorResponse } from '@application/Utils';
import { NextFunction, Request, Response } from 'express';

export const ErrorHandler = (
    error: Error | BaseError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('[ERROR]', { error });

    let status = 500,
        message = 'Something went wrong';

    if (error instanceof BaseError) {
        status = error.status;
        message = error.message;

        errorResponse(res, message, status);
        return next();
    }

    errorResponse(res, message, status);
    return next();
};
