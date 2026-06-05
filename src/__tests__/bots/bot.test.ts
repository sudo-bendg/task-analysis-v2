jest.mock('../../logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const mockOn = jest.fn();
const mockStartPolling = jest.fn();
const mockClose = jest.fn();
const mockSendMessage = jest.fn();

jest.mock('typescript-telegram-bot-api', () => ({
  TelegramBot: jest.fn().mockImplementation(() => ({
    on: mockOn,
    startPolling: mockStartPolling,
    close: mockClose,
    sendMessage: mockSendMessage,
  })),
}));

import { Bot } from '../../bots/bot';
import { TelegramBot } from 'typescript-telegram-bot-api';

describe('Bot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('instantiates a TelegramBot with the provided token', () => {
    new Bot('test-token-123');
    expect(TelegramBot).toHaveBeenCalledWith({ botToken: 'test-token-123' });
  });

  it('starts polling on construction', () => {
    new Bot('test-token');
    expect(mockStartPolling).toHaveBeenCalledTimes(1);
  });

  it('registers a message listener on construction', () => {
    new Bot('test-token');
    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('sets the default type to "genericBot"', () => {
    const bot = new Bot('test-token');
    expect(bot.type).toBe('genericBot');
  });

  it('sets a custom type when provided', () => {
    const bot = new Bot('test-token', 'MyCustomBot');
    expect(bot.type).toBe('MyCustomBot');
  });

  it('exposes the underlying TelegramBot instance as bot', () => {
    const bot = new Bot('test-token');
    expect(bot.bot).toBeDefined();
    expect(bot.bot.startPolling).toBe(mockStartPolling);
  });

  it('calls bot.close() when close() is called', () => {
    const bot = new Bot('test-token');
    bot.close();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
