// import Database from '@infrastructure/Database';
// import { Router } from 'express';

// const router = Router();

// // account
// router.post('/account/register', register);
// router.post('/account/login', logIn);
// router.post('/account/forget_password', forgotPassword);
// router.post('/account/reset_password', resetPassword);
// router.post('/account/verify_otp', verifyOTP);
// router.post('/account/verify_email', verifyEmail);

// router.get('/account', authorize, getUser);
// router.get('/account/get_personalInfo', authorize, getInfo);
// router.post('/account/feedback', authorize, feedback);
// router.post('/account/set_personalInfo', authorize, setInfo);
// router.post('/account/contact_us', contactUs);
// router.post(
//     '/account/upgrade_to_premium',
//     authorize,
//     verifyPremiuim,
//     upgradeToPremium,
// );

// // covers
// router.post('/cover/generate_cover', authorize, verifyPremiuim, generateCover);
// router.get('/cover/get_covers', authorize, getCovers);

// // resumes
// router.post(
//     '/resume/upload',
//     authorize,
//     uploadFile.single('file'),
//     extractPDFInfo,
// );
// router.get('/resume', authorize, getResumes);
