export interface SignUpDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    signUpType: string;
}

export interface LogInDTO {
    email: string;
    password?: string;
    signInType: string;
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

export enum SignUpType {
    GOOGLE = 'GOOGLE',
    MANUAL = 'MANUAL',
}
