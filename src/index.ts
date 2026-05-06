import dotenv from "dotenv";
import { Bot, TaskRecieverBot } from "./classes/bots";
import { getConnection } from "./db/ connection";
import { TaskModel } from "./db/taskModel";

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "";
const TELEGRAM_TOKEN_TASK_RECIEVER = process.env.TELEGRAM_TOKEN_TASK_RECIEVER || "";
const TOKEN = process.env.TELEGRAM_TOKEN || "";

(async () => {
  await getConnection(DB_CONNECTION_STRING);

  await TaskModel.create({
    taskDescription:
      "I spun up a mongodb docker container on my home network, and connected a node/typescript program to it",
    timeStamp: Date.now(),
  });

  const taskRecieverBot = new TaskRecieverBot(TELEGRAM_TOKEN_TASK_RECIEVER);
  const genericBot = new Bot(TOKEN)
})();

//const bot = new Bot(TOKEN);
//bot.close();
