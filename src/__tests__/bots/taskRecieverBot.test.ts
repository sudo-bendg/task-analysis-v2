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

const mockCreate = jest.fn().mockResolvedValue({});
jest.mock('../../db/taskModel', () => ({
  TaskModel: { create: mockCreate },
}));

const mockFindMisunderstoodPhrases = jest.fn();
jest.mock('../../ollamaConnector', () => ({
  findMisunderstoodPhrases: mockFindMisunderstoodPhrases,
  identifySkillsInTask: jest.fn(),
  identifyRelevantSupertasks: jest.fn(),
}));

const mockHandleNewTask = jest.fn().mockResolvedValue(undefined);
jest.mock('../../eventListeners', () => ({
  handleNewTask: mockHandleNewTask,
}));

import { TaskRecieverBot } from '../../bots/taskRecieverBot';
import { AnalysisStages } from '../../constants';

describe('TaskRecieverBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs without throwing', () => {
    expect(() => new TaskRecieverBot('token-task')).not.toThrow();
  });

  it('starts polling on construction', () => {
    new TaskRecieverBot('token-task');
    expect(mockStartPolling).toHaveBeenCalledTimes(1);
  });

  it('registers a message listener', () => {
    new TaskRecieverBot('token-task');
    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function));
  });

  describe('requiresClarification', () => {
    it('returns false when model responds with "none"', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('none');
      const bot = new TaskRecieverBot('token-task');
      const result = await bot.requiresClarification({ text: 'simple task' } as any);
      expect(result).toBe(false);
    });

    it('returns false when model responds with "None" (case-insensitive)', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('None');
      const bot = new TaskRecieverBot('token-task');
      const result = await bot.requiresClarification({ text: 'simple task' } as any);
      expect(result).toBe(false);
    });

    it('returns false when model responds with "NONE" (uppercase)', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('NONE');
      const bot = new TaskRecieverBot('token-task');
      const result = await bot.requiresClarification({ text: 'simple task' } as any);
      expect(result).toBe(false);
    });

    it('returns true when model responds with a clarification request', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('Please clarify what "K8s" means');
      const bot = new TaskRecieverBot('token-task');
      const result = await bot.requiresClarification({ text: 'Deploy to K8s' } as any);
      expect(result).toBe(true);
    });

    it('calls findMisunderstoodPhrases with the message text', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('None');
      const bot = new TaskRecieverBot('token-task');
      const text = 'specific task text';
      await bot.requiresClarification({ text } as any);
      expect(mockFindMisunderstoodPhrases).toHaveBeenCalledWith(text);
    });

    it('uses empty string when message.text is undefined', async () => {
      mockFindMisunderstoodPhrases.mockResolvedValue('None');
      const bot = new TaskRecieverBot('token-task');
      await bot.requiresClarification({ text: undefined } as any);
      expect(mockFindMisunderstoodPhrases).toHaveBeenCalledWith('');
    });
  });

  describe('createTask', () => {
    it('calls TaskModel.create with taskDescription from message', async () => {
      const bot = new TaskRecieverBot('token-task');
      const message = { text: 'my task', from: { id: 42 } };
      await bot.createTask(message as any, AnalysisStages.NEW);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ taskDescription: 'my task' })
      );
    });

    it('calls TaskModel.create with the provided status', async () => {
      const bot = new TaskRecieverBot('token-task');
      await bot.createTask({ text: 'task', from: { id: 1 } } as any, AnalysisStages.REQUIRES_CLARIFICATION);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ status: AnalysisStages.REQUIRES_CLARIFICATION })
      );
    });

    it('calls TaskModel.create with fromUser from message.from.id', async () => {
      const bot = new TaskRecieverBot('token-task');
      await bot.createTask({ text: 'task', from: { id: 99 } } as any, AnalysisStages.NEW);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ fromUser: 99 })
      );
    });

    it('calls TaskModel.create exactly once', async () => {
      const bot = new TaskRecieverBot('token-task');
      await bot.createTask({ text: 'task', from: { id: 1 } } as any, AnalysisStages.NEW);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });
});
