import OpenAI from 'openai';
import config from '@application/Config/config';

export const sendPrompt = async (prompt: string): Promise<string> => {
    try {
        const openAI = new OpenAI({ apiKey: config.TOKEN_KEYS.OPEN_AI });
        const recievedChat = await openAI.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'gpt-3.5-turbo',
            // stream: true,
        });
        return recievedChat.choices[0].message.content as string;
    } catch (error) {
        throw Error((error as Error).message);
    }
};
