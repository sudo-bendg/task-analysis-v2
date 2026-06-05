jest.mock('../logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

jest.mock('typescript-telegram-bot-api', () => ({
  TelegramBot: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    startPolling: jest.fn(),
    close: jest.fn(),
    sendMessage: jest.fn().mockResolvedValue(undefined),
  })),
}));

const mockFind = jest.fn();
const mockUpdateOne = jest.fn().mockResolvedValue({});
jest.mock('../db/taskModel', () => ({
  TaskModel: {
    find: mockFind,
    updateOne: mockUpdateOne,
  },
}));

const mockIdentifySkillsInTask = jest.fn();
const mockIdentifyRelevantSupertasks = jest.fn();
const mockFindMisunderstoodPhrases = jest.fn();
jest.mock('../ollamaConnector', () => ({
  identifySkillsInTask: mockIdentifySkillsInTask,
  identifyRelevantSupertasks: mockIdentifyRelevantSupertasks,
  findMisunderstoodPhrases: mockFindMisunderstoodPhrases,
}));

const mockRequestClarification = jest.fn().mockResolvedValue(undefined);
jest.mock('../bots/clarificationRequestorBot', () => ({
  ClarificationRequestorBot: jest.fn().mockImplementation(() => ({
    requestClarification: mockRequestClarification,
    type: 'ClarificationRequestorBot',
    bot: { on: jest.fn(), startPolling: jest.fn(), close: jest.fn() },
    close: jest.fn(),
  })),
}));

import { handleNewTask } from '../eventListeners';
import { AnalysisStages } from '../constants';

const makeExec = (tasks: any[]) => ({ exec: jest.fn().mockResolvedValue(tasks) });

describe('handleNewTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries for NEW and REQUIRES_CLARIFICATION tasks', async () => {
    mockFind.mockReturnValue(makeExec([]));
    await handleNewTask();
    expect(mockFind).toHaveBeenCalledWith({
      $or: [
        { status: AnalysisStages.NEW },
        { status: AnalysisStages.REQUIRES_CLARIFICATION },
      ],
    });
  });

  it('does nothing when there are no tasks', async () => {
    mockFind.mockReturnValue(makeExec([]));
    await handleNewTask();
    expect(mockIdentifySkillsInTask).not.toHaveBeenCalled();
    expect(mockRequestClarification).not.toHaveBeenCalled();
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it('calls requestClarification for REQUIRES_CLARIFICATION tasks', async () => {
    const task = {
      _id: 'id-1',
      status: AnalysisStages.REQUIRES_CLARIFICATION,
      taskDescription: 'Deploy K8s cluster',
      fromUser: 42,
    };
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockRequestClarification).toHaveBeenCalledWith('Deploy K8s cluster', 42);
  });

  it('does not call identifySkillsInTask for REQUIRES_CLARIFICATION tasks', async () => {
    const task = {
      _id: 'id-1',
      status: AnalysisStages.REQUIRES_CLARIFICATION,
      taskDescription: 'some task',
      fromUser: 1,
    };
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockIdentifySkillsInTask).not.toHaveBeenCalled();
  });

  it('calls identifySkillsInTask for NEW tasks', async () => {
    const task = {
      _id: 'id-2',
      status: AnalysisStages.NEW,
      taskDescription: 'Built a React dashboard',
      fromUser: 7,
    };
    mockIdentifySkillsInTask.mockResolvedValue('React, Frontend Development');
    mockIdentifyRelevantSupertasks.mockResolvedValue('Code implementation');
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockIdentifySkillsInTask).toHaveBeenCalledWith('Built a React dashboard');
  });

  it('calls identifyRelevantSupertasks with parsed skills for NEW tasks', async () => {
    const task = {
      _id: 'id-3',
      status: AnalysisStages.NEW,
      taskDescription: 'Wrote unit tests',
      fromUser: 5,
    };
    mockIdentifySkillsInTask.mockResolvedValue('TypeScript, Testing, TDD');
    mockIdentifyRelevantSupertasks.mockResolvedValue('Test design');
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockIdentifyRelevantSupertasks).toHaveBeenCalledWith(
      expect.arrayContaining(['TypeScript', ' Testing', ' TDD']),
      'Wrote unit tests'
    );
  });

  it('updates task with combined skills and INITIAL_ANALYSIS_COMPLETE status', async () => {
    const task = {
      _id: 'task-id-99',
      status: AnalysisStages.NEW,
      taskDescription: 'Deployed a service',
      fromUser: 3,
    };
    mockIdentifySkillsInTask.mockResolvedValue('Docker, CI/CD');
    mockIdentifyRelevantSupertasks.mockResolvedValue('Deployment engineering');
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: 'task-id-99' },
      expect.objectContaining({
        status: AnalysisStages.INITIAL_ANALYSIS_COMPLETE,
        skills: expect.arrayContaining(['Docker', ' CI/CD', 'Deployment engineering']),
      })
    );
  });

  it('processes multiple tasks in one call', async () => {
    const tasks = [
      { _id: 'a', status: AnalysisStages.NEW, taskDescription: 'Task A', fromUser: 1 },
      { _id: 'b', status: AnalysisStages.REQUIRES_CLARIFICATION, taskDescription: 'Task B', fromUser: 2 },
    ];
    mockIdentifySkillsInTask.mockResolvedValue('Skill A');
    mockIdentifyRelevantSupertasks.mockResolvedValue('Super A');
    mockFind.mockReturnValue(makeExec(tasks));
    await handleNewTask();
    expect(mockIdentifySkillsInTask).toHaveBeenCalledTimes(1);
    expect(mockRequestClarification).toHaveBeenCalledTimes(1);
  });

  it('throws an error when TaskModel.find rejects', async () => {
    mockFind.mockReturnValue({ exec: jest.fn().mockRejectedValue(new Error('DB error')) });
    await expect(handleNewTask()).rejects.toThrow('Error thrown in globalEventListener');
  });

  it('uses empty string for taskDescription when it is undefined', async () => {
    const task = {
      _id: 'id-x',
      status: AnalysisStages.NEW,
      taskDescription: undefined,
      fromUser: 1,
    };
    mockIdentifySkillsInTask.mockResolvedValue('none');
    mockIdentifyRelevantSupertasks.mockResolvedValue('none');
    mockFind.mockReturnValue(makeExec([task]));
    await handleNewTask();
    expect(mockIdentifySkillsInTask).toHaveBeenCalledWith('');
  });
});
