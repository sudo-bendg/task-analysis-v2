import { TelegramBot } from "typescript-telegram-bot-api";
import { logger } from "../logger";

class Bot {
  bot: TelegramBot;
  type: string;

  constructor(TOKEN: string, type: string = 'genericBot') {
    this.type = type
    this.bot = new TelegramBot({ botToken: TOKEN });
    this.bot.startPolling();

    this.bot.on("message", (message) => {
      logger.info(`Recieved message: ${message.text}`);
    });
  }

  close() {
    this.bot.close();
  }
}

export { Bot };
