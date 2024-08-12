import { sendPrompt } from '@infrastructure/OpenAI/openai';
import config from '@application/Config/config';

export interface IOpenAI {
    GenerateCover(promptInfo: IPropmtInfo): Promise<string>;
}

export interface IPropmtInfo {
    employer: string;
    jobTitle: string;
    jobDescription: string;
    resumeInfo: string;
}

export class OpenAI implements IOpenAI {
    async GenerateCover(promptInfo: IPropmtInfo): Promise<string> {
        const prompt = `${config.PROMPTS.BEGIN}:

            Company name: ${promptInfo.employer}.
            Role: ${promptInfo.jobTitle}.
            Role Description: ${promptInfo.jobDescription}.

            ${promptInfo.resumeInfo}

            ${config.PROMPTS.CONCLUSION}
            `;
        const letter = await sendPrompt(prompt);
        return letter;
    }
}
