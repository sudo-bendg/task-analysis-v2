import dotenv from "dotenv";
import { Bot, TaskRecieverBot, ClarificationRequestorBot } from "./bots";
import { getConnection } from "./db/ connection";
import { TaskModel } from "./db/taskModel";
import { identifySkillsInTask } from './ollamaConnector/index'
import { AnalysisStages } from './constants'
import { EventEmitter } from 'events';

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "";
const TELEGRAM_TOKEN_TASK_RECIEVER = process.env.TELEGRAM_TOKEN_TASK_RECIEVER || "";
const TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR = process.env.TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR || "";
const TOKEN = process.env.TELEGRAM_TOKEN || "";

const globalEventListener = new EventEmitter();



(async () => {
  await getConnection(DB_CONNECTION_STRING);

  const taskRecieverBot = new TaskRecieverBot(TELEGRAM_TOKEN_TASK_RECIEVER, globalEventListener);
  const clarificationRequestorBot = new ClarificationRequestorBot(TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR)
  const genericBot = new Bot(TOKEN)

  globalEventListener.on("Task Recieved", async () => {
    const newTasks = await TaskModel.find({
      $or: [{'status': AnalysisStages.NEW}, {'status': AnalysisStages.REQUIRES_CLARIFICATION}]
    }).exec();
    for (const task of newTasks) {
      if (task.status === AnalysisStages.REQUIRES_CLARIFICATION) {
        clarificationRequestorBot.requestClarification(task.taskDescription || '', task.fromUser || -1)
      } else {
        const skillsString: string = await identifySkillsInTask(task.taskDescription || '');
        const skillsArray = skillsString.split(',')
        skillsArray.map(skill => skill.trim());
        await TaskModel.updateOne({_id: task._id}, {skills: skillsArray, status: AnalysisStages.LOGGED})
      }
    }
  });

})();

//const bot = new Bot(TOKEN);
//bot.close();
