import { Bot } from './bot';
import { Message } from 'typescript-telegram-bot-api';
import { TaskModel } from '../db/taskModel';
import { findMisunderstoodPhrases } from '../ollamaConnector';
import { AnalysisStages } from '../constants'
import { EventEmitter } from 'events';
import { logger } from '../logger';

class TaskRecieverBot extends Bot {
    constructor(TOKEN: string, globalEventListener: EventEmitter) {
        super(TOKEN, 'TaskRecieverBot');

        this.bot.on("message", async (message: Message) => {
            let requriesClarification = false;
            if (message.text){
                logger.info("Received message:", message.text);
                logger.info("starting analysis of messsage")
                const misunderstoodPhrasesResponse: string = await findMisunderstoodPhrases(message.text);
                logger.info("finished analysis")
                if (misunderstoodPhrasesResponse.toLowerCase() !== 'none') {
                    requriesClarification = true;
                }
                const statusVal = requriesClarification ? AnalysisStages.REQUIRES_CLARIFICATION : AnalysisStages.NEW;
                TaskModel.create({
                    taskDescription: message.text,
                    status: statusVal,
                    fromUser: message.from?.id
                })         
                globalEventListener.emit("Task Recieved");       
            }
        });
    }
}

export { TaskRecieverBot }