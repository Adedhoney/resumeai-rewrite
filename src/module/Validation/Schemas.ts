import Joi from 'joi';

export const ManualSignUpSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().required(),
});
export const GoogleSignInSchema = Joi.object({
    accessToken: Joi.string().required(),
});

export const SaveProfessionalInfoSchema = Joi.object({
    skills: Joi.array().optional(),
    // .items(
    //     Joi.object().keys({
    //         skill: Joi.string().required(),
    //         yearsOfExp: Joi.number().required(),
    //     }),
    // )
    // .optional(),
    workExp: Joi.array()
        .items(
            Joi.object().keys({
                isCurrentWork: Joi.boolean().required(),
                expType: Joi.string().required(),
                employer: Joi.string().required(),
                jobTitle: Joi.string().required(),
                details: Joi.string().required(),
                startDate: Joi.string().required(),
                endDate: Joi.string().optional(),
            }),
        )
        .optional(),
    education: Joi.array()
        .items(
            Joi.object().keys({
                school: Joi.string().required(),
                degree: Joi.string().required(),
                fieldOfStudy: Joi.string().required(),
                startDate: Joi.string().required(),
                endDate: Joi.string().optional(),
                grade: Joi.string().optional(),
                activities: Joi.string().optional(),
                description: Joi.string().optional(),
            }),
        )
        .optional(),
});
export const ManualLogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
export const ContactUsSchema = Joi.object({
    email: Joi.string().required(),
    message: Joi.string().required(),
    name: Joi.string().required(),
});
export const VerifyOtpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
});
export const ResetPasswordSchema = Joi.object({
    otpToken: Joi.string().required(),
    newPassword: Joi.string().required(),
});
export const FeedbackSchema = Joi.object({
    feedback: Joi.string().required(),
});

export const GenerateCoverSchema = Joi.object({
    employer: Joi.string().required(),
    jobTitle: Joi.string().required(),
    jobDescription: Joi.string().required(),
    infoType: Joi.string().required(),
    resumeId: Joi.string().optional(),
    manualInfo: Joi.object().optional(),
});
