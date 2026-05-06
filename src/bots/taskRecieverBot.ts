import { Bot } from './bot';
import { Message } from 'typescript-telegram-bot-api';
import { TaskModel } from '../db/taskModel';
import { findMisunderstoodPhrases } from '../ollamaConnector';
import { AnalysisStages } from '../constants'
import { EventEmitter } from 'events';

class TaskRecieverBot extends Bot {
    constructor(TOKEN: string, globalEventListener: EventEmitter) {
        super(TOKEN, 'TaskRecieverBot');

        this.bot.on("message", async (message: Message) => {
            console.log(message)
            let requriesClarification = false;
            if (message.text){
                console.log("Received message:", message.text);
                console.log("starting analysis")
                const misunderstoodPhrasesResponse: string = await findMisunderstoodPhrases(message.text);
                console.log("finished analysis")
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