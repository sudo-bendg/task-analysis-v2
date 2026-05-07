import dotenv from "dotenv";
import { TaskRecieverBot } from "./bots";
import { getConnection } from "./db/ connection";
import { EventEmitter } from 'events';

dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "";
const TELEGRAM_TOKEN_TASK_RECIEVER = process.env.TELEGRAM_TOKEN_TASK_RECIEVER || "";

const TOKEN = process.env.TELEGRAM_TOKEN || "";

const globalEventListener = new EventEmitter();

(async () => {
  // initialise db connection
  await getConnection(DB_CONNECTION_STRING);

  // initialise bots
  const taskRecieverBot = new TaskRecieverBot(TELEGRAM_TOKEN_TASK_RECIEVER, globalEventListener);

})();
