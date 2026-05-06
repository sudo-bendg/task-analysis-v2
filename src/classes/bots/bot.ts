import { TelegramBot } from "typescript-telegram-bot-api";

class Bot {
  bot: TelegramBot;
  type: string;

  constructor(TOKEN: string, type: string = 'genericBot') {
    this.type = type
    this.bot = new TelegramBot({ botToken: TOKEN });
    this.bot.startPolling();

    this.bot.on("message", (message) => {
      console.log("Received message:", message.text);
    });
  }

  close() {
    this.bot.close();
  }
}

export { Bot };
