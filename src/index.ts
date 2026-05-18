import dotenv from "dotenv";
import { TaskRecieverBot } from "./bots";
import { getConnection } from "./db/ connection";
import { EventEmitter } from 'events';
import { logger } from "./logger";

logger.info("Task analysis pipeline is starting up")

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "";
const TELEGRAM_TOKEN_TASK_RECIEVER = process.env.TELEGRAM_TOKEN_TASK_RECIEVER || "";

const TOKEN = process.env.TELEGRAM_TOKEN || "";

(async () => {
  try{
    const globalEventListener = new EventEmitter();

    await getConnection(DB_CONNECTION_STRING);
    logger.info("Database is connected")

    // initialise bots
    logger.info("Initialising taskRecieverBot")
    const taskRecieverBot = new TaskRecieverBot(TELEGRAM_TOKEN_TASK_RECIEVER, globalEventListener);
  }
  catch (err: any) {
    logger.error(`An error occurred: ${err}`);
  }
})();
