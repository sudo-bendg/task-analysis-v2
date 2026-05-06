import { Bot } from './bot';
import { Message } from 'typescript-telegram-bot-api';
import { TaskModel } from '../../db/taskModel';

class TaskRecieverBot extends Bot {
    constructor(TOKEN: string) {
        super(TOKEN, 'TaskRecieverBot');
    }

    async createTask(message: Message) {
        TaskModel.create({
            taskDescription: message.text
        })
    }
}

export { TaskRecieverBot }