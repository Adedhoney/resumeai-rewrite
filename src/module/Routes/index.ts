import Database from '@infrastructure/Database';
import {
    AccountController,
    CoverController,
    ResumeController,
} from '@module/Controller';
import {
    AccountRepository,
    CoverRepository,
    ResumeRepository,
} from '@module/Domain/Repository';
import { AccountNotification } from '@module/Infrastructure/Notification';
import { OpenAI } from '@module/Infrastructure/OpenAI/openai';
import { Authentication, UploadFile, Validation } from '@module/Middleware';
import { AccountService, CoverService, ResumeService } from '@module/Service';
import {
    ContactUsSchema,
    FeedbackSchema,
    GenerateCoverSchema,
    GoogleSignInSchema,
    ManualLogInSchema,
    ManualSignUpSchema,
    ResetPasswordSchema,
    SaveProfessionalInfoSchema,
    VerifyOtpSchema,
} from '@module/Validation';
import { Router } from 'express';

const router = Router();

const db = Database;
db.sequelize.sync().then(() => console.log('synced'));

const acctrepo = new AccountRepository(db);
const coverrepo = new CoverRepository(db);
const resumerepo = new ResumeRepository(db);
const openai = new OpenAI();
const acctnotif = new AccountNotification();

const Auth = Authentication(acctrepo);
const acctctr = new AccountController(new AccountService(acctrepo, acctnotif));
const coverctr = new CoverController(
    new CoverService(coverrepo, resumerepo, openai),
);
const resumectr = new ResumeController(new ResumeService(resumerepo));

// // account
router.post(
    '/account/register',
    Validation(ManualSignUpSchema),
    acctctr.manualSignUp,
);
router.post(
    '/account/login',
    Validation(ManualLogInSchema),
    acctctr.manualLogIn,
);
router.post(
    '/account/signin/google',
    Validation(GoogleSignInSchema),
    acctctr.googleSignIn,
);
router.post('/account/forget-password/:email', acctctr.forgotPassword);
router.post(
    '/account/reset-password',
    Validation(ResetPasswordSchema),
    acctctr.resetPassword,
);
router.post(
    '/account/verify-otp',
    Validation(VerifyOtpSchema),
    acctctr.verifyOTP,
);
router.post(
    '/account/verify-email',
    Validation(VerifyOtpSchema),
    acctctr.verifyEmail,
);

router.get('/account', Auth, acctctr.getUser);
router.get('/account/get-professionalInfo', Auth, acctctr.getProfessionalInfo);
router.post(
    '/account/feedback',
    Auth,
    Validation(FeedbackSchema),
    acctctr.feedback,
);
router.post(
    '/account/set-professionalInfo',
    Auth,
    Validation(SaveProfessionalInfoSchema),
    acctctr.setProfessionalInfo,
);
router.post(
    '/account/contact-us',
    Validation(ContactUsSchema),
    acctctr.contactUs,
);
// router.post(
//     '/account/upgrade_to_premium',
//     authorize,
//     verifyPremiuim,
//     upgradeToPremium,
// );

// // covers
router.post(
    '/cover',
    Auth,
    Validation(GenerateCoverSchema),
    coverctr.generateCover,
);
router.get('/cover', Auth, coverctr.getUserCovers);
router.get('/cover/:coverId', Auth, coverctr.getCover);

// // resumes
router.post('/resume', Auth, UploadFile.single('file'), resumectr.uploadResume);
router.get('/resume', Auth, resumectr.getUserResumes);
router.get('/resume/:resumeId', Auth, resumectr.getResume);

export { router };
