import { Bot } from './bot';

class ClarificationRequestorBot extends Bot {
    constructor(TOKEN: string) {
        super(TOKEN, 'ClarificationRequestorBot');
    }

    async requestClarification(message: string, userId: number) {
        const messageToSend = `The bot faced some misunderstanding with this request:\n\n${message}`
        this.bot.sendMessage({
            chat_id: userId,
            text: messageToSend
        })
    }
}

export { ClarificationRequestorBot }