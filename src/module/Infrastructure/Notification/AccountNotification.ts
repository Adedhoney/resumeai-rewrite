import { Notification } from '@infrastructure/Notification';
import config from '@application/Config/config';

export interface IforgotPasswordEmail {
    to: string;
    otp: string;
    fullName: string;
}

export interface IAccountNotification {
    forgotPasswordEmail(
        email: string,
        OTP: string,
        firstName: string,
    ): Promise<void>;
    welcomeMail(email: string, firstName: string): Promise<void>;
    confirmMail(email: string, OTP: string, firstName: string): Promise<void>;
    feedbackEmail(
        email: string,
        firstName: string,
        feedback: string,
    ): Promise<void>;
    ContactUsMail(email: string, name: string, feedback: string): Promise<void>;
}

export class AccountNotification
    extends Notification
    implements IAccountNotification
{
    async welcomeMail(email: string, firstName: string): Promise<void> {
        const mailOptions = {
            to: email,
            message: '',
            subject: 'Welcome',
            text: `Welcome to MyresumeAI`,
            html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <title>NodeMailer Email Template</title>
                        <style>
                          .container {
                            width: 100%;
                            height: 100%;
                            padding: 20px;
                            background-color: #fff;
                          }
                          .logo-header {
                            display: flex;
                            flex-direction: row;
                          }
                          .company-name {
        
                          }
                          .button-link {
                            padding: 10px 20px;
                            background-color: #F55B23;
                            color: #fff;
                            text-decoration: none;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            text-align: center;
                        }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <div class="logo-header">
                          <img src="https://myresumai.xyz/static/media/logo.9aee6a42492be2f12e8db05ad1294517.svg" alt="MyresumeAI Logo">
                          <h2 class="company-name">MyresumeAI</h2>
                          </div>
                          <div class="email">
                            <div class="email-header">
                              <h1>We're pleased to meet you</h1>
                            </div>
                            <br></br>
                            <div class="email-body">
                              <p>Hi ${firstName || 'User'}</p>
                              <p>We're glad to have you join us! You're already on your way to standing out in your job search and applications.</p>
                              <p>If there's anything you need, we'll be here every step of the way. Follow the link below to create your very first cover letter and join thousands of other users around the globe.</p>
                              <p>Cheers,</p>
                              <p>MyresumeAI Team</p>
                              <a href="https://myresumai.xyz/" class="button-link">Let's go!</a>
                            </div>
                          </div>
                        </div>
                      </body>
                    </html>
                    `,
        };
        await this.email(mailOptions);
    }

    async confirmMail(
        email: string,
        OTP: string,
        firstName: string,
    ): Promise<void> {
        const mailOptions = {
            to: email,
            message: '',
            subject: 'ResumeAI OTP',
            text: `Your OTP is ${OTP}.  It expires in 20 minutes`,
            html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>NodeMailer Email Template</title>
                <style>
                  .container {
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    background-color: #fff;
                  }
                  .logo-header {
                    display: flex;
                    flex-direction: row;
                  }
                  .company-name {
    
                  }
                  .OTP {
                    display: flex;
                    flex-direction: row;
                  }
                  .otp-box {
                    width: 40px;
                    height: 40px;
                    border: 1px solid #ccc;
                    text-align: center;
                    line-height: 40px;
                    font-size: 20px;
                    margin-right: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="logo-header">
                  <img src="https://myresumai.xyz/static/media/logo.9aee6a42492be2f12e8db05ad1294517.svg" alt="MyresumeAI Logo">
                  <h2 class="company-name">MyresumeAI</h2>
                  </div>
                  <div class="email">
                    <div class="email-header">
                      <h1>Confirm your email address</h1>
                    </div>
                    <br></br>
                    <div class="email-body">
                      <p>Hi ${firstName || 'User'}!</p>
                      <p>Thank your for signing up on MyresumeAI. We need to make sure this email address is yours. To complete the setup of your account, use the OTP below</p>
                      <div class="OTP">
                      <p class="otp-box"> ${OTP[0]}</p>
                      <p class="otp-box"> ${OTP[1]}</p>
                      <p class="otp-box"> ${OTP[2]}</p>
                      <p class="otp-box"> ${OTP[3]}</p>
                      <p class="otp-box"> ${OTP[4]}</p>
                      <p class="otp-box"> ${OTP[5]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
            `,
        };
        await this.email(mailOptions);
    }
    async forgotPasswordEmail(
        email: string,
        OTP: string,
        firstName: string,
    ): Promise<void> {
        const mailOptions = {
            to: email,
            message: '',
            subject: 'ResumeAI OTP',
            text: `Your OTP is ${OTP}.  It expires in 20 minutes`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>NodeMailer Email Template</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #fff;
              }
              .logo-header {
                display: flex;
                flex-direction: row;
              }
              .company-name {
    
              }
              .OTP {
                display: flex;
                flex-direction: row;
              }
              .otp-box {
                width: 60px;
                height: 60px;
                border: 1px solid #2969FF;
                border-radius: 10px;
                text-align: center;
                font-size: 30px;
                line-height: 60px;
                font-size: 20px;
                margin-right: 7px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo-header">
              <img src="https://myresumai.xyz/static/media/logo.9aee6a42492be2f12e8db05ad1294517.svg" alt="MyresumeAI Logo">
              <h2 class="company-name">MyresumeAI</h2>
              </div>
              <div class="email">
                <div class="email-header">
                  <h1>Reset Password</h1>
                </div>
                <br></br>
                <div class="email-body">
                  <p>Hi ${firstName}</p>
                  <p>You requested to change your password. Use the OTP below to complete the process.</p>
                  <div class="OTP">
                  <p class="otp-box"> ${OTP[0]}</p>
                  <p class="otp-box"> ${OTP[1]}</p>
                  <p class="otp-box"> ${OTP[2]}</p>
                  <p class="otp-box"> ${OTP[3]}</p>
                  <p class="otp-box"> ${OTP[4]}</p>
                  <p class="otp-box"> ${OTP[5]}</p>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
        `,
        };

        await this.email(mailOptions);
    }
    async feedbackEmail(
        email: string,
        firstName: string,
        feedback: string,
    ): Promise<void> {
        const mailOptions = {
            to: config.SMTP.EMAIL as string,
            message: '',
            subject: `Feedback from ${email}`,
            text: feedback,
            html: `<p>${feedback}<p>`,
        };
        const responseOptions = {
            to: email,
            message: '',
            subject: 'Feedback Recieved',
            text: `Thank you for your feedback`,
            html: `<h3>Dear, ${firstName}<h3><p>Thank you for sending your feedback. Our team will review it as soon as possible<p>`,
        };

        this.email(responseOptions);
        this.email(mailOptions);
    }
    async ContactUsMail(
        email: string,
        name: string,
        message: string,
    ): Promise<void> {
        const mailOptions = {
            to: config.SMTP.EMAIL as string,
            message: '',
            subject: `Contact Us message from ${name}, ${email}`,
            text: message,
            html: `<p>${message}<p>`,
        };
        const responseOptions = {
            to: email,
            message: '',
            subject: `Message Recieved`,
            text: `Dear, ${name} Thank you for contacting us. Our team will review it as soon as possible`,
            html: `<h3>Dear, ${name}<h3><p>Thank you for contacting us. Our team will review it as soon as possible<p>`,
        };

        this.email(responseOptions);
        this.email(mailOptions);
    }
}
