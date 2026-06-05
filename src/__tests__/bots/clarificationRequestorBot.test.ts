jest.mock('../../logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const mockOn = jest.fn();
const mockStartPolling = jest.fn();
const mockClose = jest.fn();
const mockSendMessage = jest.fn().mockResolvedValue(undefined);

jest.mock('typescript-telegram-bot-api', () => ({
  TelegramBot: jest.fn().mockImplementation(() => ({
    on: mockOn,
    startPolling: mockStartPolling,
    close: mockClose,
    sendMessage: mockSendMessage,
  })),
}));

import { ClarificationRequestorBot } from '../../bots/clarificationRequestorBot';

describe('ClarificationRequestorBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs without throwing', () => {
    expect(() => new ClarificationRequestorBot('token-abc')).not.toThrow();
  });

  it('starts polling on construction', () => {
    new ClarificationRequestorBot('token-abc');
    expect(mockStartPolling).toHaveBeenCalledTimes(1);
  });

  it('has type set to "ClarificationRequestorBot"', () => {
    const bot = new ClarificationRequestorBot('token-abc');
    expect(bot.type).toBe('ClarificationRequestorBot');
  });

  describe('requestClarification', () => {
    it('calls sendMessage with the correct chat_id', async () => {
      const bot = new ClarificationRequestorBot('token-abc');
      await bot.requestClarification('What is K8s?', 12345);
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ chat_id: 12345 })
      );
    });

    it('calls sendMessage with a message containing the original text', async () => {
      const bot = new ClarificationRequestorBot('token-abc');
      const originalMessage = 'Deployed Helm chart to K8s cluster';
      await bot.requestClarification(originalMessage, 99);
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ text: expect.stringContaining(originalMessage) })
      );
    });

    it('sends a string text (not undefined)', async () => {
      const bot = new ClarificationRequestorBot('token-abc');
      await bot.requestClarification('some message', 1);
      const call = mockSendMessage.mock.calls[0][0];
      expect(typeof call.text).toBe('string');
      expect(call.text.length).toBeGreaterThan(0);
    });

    it('calls sendMessage exactly once per call', async () => {
      const bot = new ClarificationRequestorBot('token-abc');
      await bot.requestClarification('message', 1);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });

    it('handles different user IDs correctly', async () => {
      const bot = new ClarificationRequestorBot('token-abc');
      await bot.requestClarification('msg', 111);
      await bot.requestClarification('msg', 222);
      expect(mockSendMessage.mock.calls[0][0].chat_id).toBe(111);
      expect(mockSendMessage.mock.calls[1][0].chat_id).toBe(222);
    });
  });
});
