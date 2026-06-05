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

import { FeedbackBot } from '../../bots/feedbackBot';

describe('FeedbackBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs without throwing', () => {
    expect(() => new FeedbackBot('token-xyz')).not.toThrow();
  });

  it('starts polling on construction', () => {
    new FeedbackBot('token-xyz');
    expect(mockStartPolling).toHaveBeenCalledTimes(1);
  });

  it('has a bot property', () => {
    const bot = new FeedbackBot('token-xyz');
    expect(bot.bot).toBeDefined();
  });

  it('registers a message listener', () => {
    new FeedbackBot('token-xyz');
    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('can call close() without throwing', () => {
    const bot = new FeedbackBot('token-xyz');
    expect(() => bot.close()).not.toThrow();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
