import { Bot } from './bot';

class ClarificationRequestorBot extends Bot {
    constructor(TOKEN: string) {
        super(TOKEN, 'ClarificationRequestorBot');
    }
}

export { ClarificationRequestorBot }