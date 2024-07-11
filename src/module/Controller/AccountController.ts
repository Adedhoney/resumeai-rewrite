import { IBaseRequest } from '@application/Request/Request';
import { successResponse } from '@application/Utils';
import {
    ContactUsDTO,
    FeedbackDTO,
    GoogleSignInDTO,
    ManualLogInDTO,
    ManualSignUpDTO,
    ResetPasswordDTO,
    VerifyOtpDTO,
    SaveProfessionalInfoDTO,
} from '@module/Domain/DTO';
import { IAccountService } from '@module/Service';
import { NextFunction, RequestHandler, Response, Request } from 'express';

export class AccountController {
    constructor(private service: IAccountService) {
        this.service = service;
    }

    manualSignUp: RequestHandler = async (
        req: IBaseRequest<ManualSignUpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ManualSignUp(req.body.data);

            return successResponse(
                res,
                `Successful. Email verification has been sent to your email`,
            );
        } catch (err) {
            next(err);
        }
    };

    googleSignIn: RequestHandler = async (
        req: IBaseRequest<GoogleSignInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const responseLogin = await this.service.GoogleSignIn(
                req.body.data,
            );

            return successResponse(res, 'Successful', { ...responseLogin });
        } catch (err) {
            next(err);
        }
    };

    manualLogIn: RequestHandler = async (
        req: IBaseRequest<ManualLogInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const responseLogin = await this.service.LogIn(req.body.data);

            return successResponse(res, 'Login', { ...responseLogin });
        } catch (err) {
            next(err);
        }
    };
    verifyEmail: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const responseLogin = await this.service.VerifyEmail(req.body.data);

            return successResponse(res, 'Login', { ...responseLogin });
        } catch (err) {
            next(err);
        }
    };
    getUser: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(res.locals.authData.userId);

            return successResponse(res, 'Login', user);
        } catch (err) {
            next(err);
        }
    };

    forgotPassword: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ForgotPassword(req.params.email);

            return successResponse(res, `OTP sent to ${req.params.email}`);
        } catch (err) {
            next(err);
        }
    };
    verifyOTP: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = await this.service.VerifyOTP(req.body.data);

            return successResponse(res, `OTP Token`, token);
        } catch (err) {
            next(err);
        }
    };

    resetPassword: RequestHandler = async (
        req: IBaseRequest<ResetPasswordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResetPassword(req.body.data);

            return successResponse(res, `Password updated`);
        } catch (err) {
            next(err);
        }
    };

    feedback: RequestHandler = async (
        req: IBaseRequest<FeedbackDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.GiveFeedback(req.body.data, res.locals.authData);

            return successResponse(res, `Feedback Gotten`);
        } catch (err) {
            next(err);
        }
    };
    contactUs: RequestHandler = async (
        req: IBaseRequest<ContactUsDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ContactUs(req.body.data);

            return successResponse(res, `Message Gotten`);
        } catch (err) {
            next(err);
        }
    };

    setProfessionalInfo: RequestHandler = async (
        req: IBaseRequest<SaveProfessionalInfoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.SetProfessionalInfo(
                req.body.data,
                res.locals.authData.userId,
            );
            return successResponse(res, `Info saved`);
        } catch (err) {
            next(err);
        }
    };

    getProfessionalInfo: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetProfessionalInfo(
                res.locals.authData.userId,
            );
            return successResponse(res, 'user Info', user);
        } catch (err) {
            next(err);
        }
    };
}
