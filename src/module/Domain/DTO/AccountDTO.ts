import { IUser } from '../Model';

export interface ManualSignUpDTO {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}
export interface GoogleSignInDTO {
    accessToken: string;
}

export interface GoogleUserDTO {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export interface SaveProfessionalInfoDTO {
    skills?: { skill: string; yearsOfExp: number }[];
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
export interface EditSkillDTO {
    skill?: string;
    yearsOfExp?: number;
}

export interface EditWorkExperienceDTO {
    isCurrentWork?: boolean;
    expType?: string;
    employer?: string;
    jobTitle?: string;
    details?: string;
    startDate?: string;
    endDate?: string;
}
export interface EditEducationDTO {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    activities?: string;
    description?: string;
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
    otpToken: string;
    newPassword: string;
}
