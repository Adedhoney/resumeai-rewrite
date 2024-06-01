import { IUser } from '../Model';

export interface ManualSignUpDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface GoogleSignInDTO {
    email: string;
    googleIdToken: string;
    firstName: string;
    lastName: string;
}

export interface ManualLogInDTO {
    email: string;
    password?: string;
}
export interface GoogleLogInDTO {
    email: string;
    googleIdToken?: string;
}

export interface loginPayload {
    token: string;
    user: IUser;
}

export interface ContactUsDTO {
    email: string;
    message: string;
    name: string;
}
export interface FeedbackDTO {
    feedback: string;
}

export interface VerifyOtpDTO {
    email: string;
    otp: string;
}

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}
