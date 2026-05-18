import { Bot } from './bot';
import { Message } from 'typescript-telegram-bot-api';
import { TaskModel } from '../db/taskModel';
import { findMisunderstoodPhrases } from '../ollamaConnector';
import { AnalysisStages } from '../constants'
import { logger } from '../logger';
import { handleNewTask } from '../eventListeners';

class TaskRecieverBot extends Bot {
    constructor(TOKEN: string) {
        super(TOKEN, 'TaskRecieverBot');

        this.bot.on("message", async (message: Message) => {
            if (message.text){
                const statusVal = await this.requiresClarification(message) ?
                    AnalysisStages.REQUIRES_CLARIFICATION :
                    AnalysisStages.NEW;
                await this.createTask(message, statusVal);
                await handleNewTask(); 
            }
        });
    }

    async requiresClarification (message: Message): Promise<boolean>{
        logger.info(`Starting requiresClarification analysis`);
        const misunderstoodPhrasesResponse: string = await findMisunderstoodPhrases(message.text || "");
        logger.info(`Ending requiresClarification analysis`);
        return misunderstoodPhrasesResponse.toLowerCase() !== 'none';
    }

    async createTask (message: Message, statusVal: AnalysisStages): Promise<void> {
        TaskModel.create({
            taskDescription: message.text,
            status: statusVal,
            fromUser: message.from?.id
        });
    }
}

export { TaskRecieverBot }