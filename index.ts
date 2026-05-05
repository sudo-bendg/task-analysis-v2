import dotenv from "dotenv";
import { Bot } from "./resources/bot";

dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN || "";

const bot = new Bot(TOKEN);
bot.close();
