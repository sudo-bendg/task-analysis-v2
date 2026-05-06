import dotenv from "dotenv";
import { Bot } from "./classes/bot";
import { getConnection } from "./db/ connection";
import { TaskModel } from "./db/taskModel";

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "";
const TOKEN = process.env.TELEGRAM_TOKEN || "";

(async () => {
  await getConnection(DB_CONNECTION_STRING);

  await TaskModel.create({
    taskDescription:
      "I spun up a mongodb docker container on my home network, and connected a node/typescript program to it",
    timeStamp: Date.now(),
  });
})();

//const bot = new Bot(TOKEN);
//bot.close();
