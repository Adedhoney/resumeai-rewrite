import { sendPrompt } from '@infrastructure/OpenAI/openai';
import config from '@application/Config/config';

export interface IOpenAI {
    GetResumeCover(promptInfo: IPropmtInfo): Promise<string>;
    GetManualCover(promptInfo: IPropmtInfo): Promise<string>;
}

export interface IPropmtInfo {
    employer: string;
    jobTitle: string;
    jobDescription: string;
    resume?: string;
    manualInfo?: string;
}

export class OpenAI implements IOpenAI {
    async GetManualCover(promptInfo: IPropmtInfo): Promise<string> {
        const prompt = `${config.PROMPTS.MANUAL}:
            """
            Company name: ${promptInfo.employer}.
            Role I am applying for: ${promptInfo.jobTitle}.
            role description: ${promptInfo.jobDescription} 

            The remaining information about me and my qualification is written below.
            
            ${promptInfo.manualInfo}
            """`;
        const letter = await sendPrompt(prompt);
        return letter;
    }
    async GetResumeCover(promptInfo: IPropmtInfo): Promise<string> {
        const prompt = `${config.PROMPTS.RESUME}:
            Name of company I am applying to: ${promptInfo.employer}.
            Role I am applying for: ${promptInfo.jobTitle}.
            role description: ${promptInfo.jobDescription}.

            """
            ${promptInfo.resume}
            """`;
        const letter = await sendPrompt(prompt);
        return letter;
    }
}
