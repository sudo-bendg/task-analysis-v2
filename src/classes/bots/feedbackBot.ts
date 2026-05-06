import { Bot } from './bot';

class FeedbackBot extends Bot {
    constructor(TOKEN: string) {
        super(TOKEN, 'ClarificationRequestorBot');
    }
}

export { FeedbackBot }