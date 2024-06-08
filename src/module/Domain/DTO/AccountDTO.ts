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

export interface SaveProfessionalInfoDTO {
    skills?: { skill: string; yearsOfExp: string }[];
    workExp?: {
        isCurrentWork: boolean;
        expType: string;
        employer: string;
        jobTitle: string;
        details: string;
        startDate: string;
        endDate?: string;
    }[];
    education?: {
        school: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate?: string;
        grade?: string;
        activities?: string;
        description?: string;
    }[];
}

export interface ManualLogInDTO {
    email: string;
    password: string;
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
