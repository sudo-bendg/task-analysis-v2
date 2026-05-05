import { TelegramBot } from "typescript-telegram-bot-api";

class Bot {
  bot: TelegramBot;

  constructor(TOKEN: string) {
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
