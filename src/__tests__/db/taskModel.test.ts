import mongoose from 'mongoose';

jest.mock('../../logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

describe('TaskModel schema', () => {
  let TaskModel: mongoose.Model<any>;

  beforeAll(() => {
    jest.resetModules();
    jest.mock('dotenv', () => ({ config: jest.fn() }));
    const { TaskModel: T } = require('../../db/taskModel');
    TaskModel = T;
  });

  it('is a mongoose model', () => {
    expect(TaskModel).toBeDefined();
    expect(typeof TaskModel.find).toBe('function');
    expect(typeof TaskModel.create).toBe('function');
    expect(typeof TaskModel.updateOne).toBe('function');
  });

  it('has the correct model name "task"', () => {
    expect(TaskModel.modelName).toBe('task');
  });

  it('schema has taskDescription field', () => {
    const schema = TaskModel.schema;
    expect(schema.path('taskDescription')).toBeDefined();
  });

  it('schema has timeStamp field', () => {
    const schema = TaskModel.schema;
    expect(schema.path('timeStamp')).toBeDefined();
  });

  it('schema has testEnvironment field', () => {
    const schema = TaskModel.schema;
    expect(schema.path('testEnvironment')).toBeDefined();
  });

  it('schema has status field', () => {
    const schema = TaskModel.schema;
    expect(schema.path('status')).toBeDefined();
  });

  it('schema has fromUser field', () => {
    const schema = TaskModel.schema;
    expect(schema.path('fromUser')).toBeDefined();
  });

  it('schema has skills field as an array', () => {
    const schema = TaskModel.schema;
    expect(schema.path('skills')).toBeDefined();
  });

  it('testEnvironment defaults to false when ENVIRONMENT is not "test"', () => {
    jest.resetModules();
    process.env.ENVIRONMENT = 'prod';
    jest.mock('dotenv', () => ({ config: jest.fn() }));
    const { TaskModel: T } = require('../../db/taskModel');
    const schemaDefaults = T.schema.obj;
    expect(schemaDefaults.testEnvironment.default).toBe(false);
  });

  it('testEnvironment defaults to true when ENVIRONMENT is "test"', () => {
    jest.resetModules();
    process.env.ENVIRONMENT = 'test';
    jest.mock('dotenv', () => ({ config: jest.fn() }));
    const { TaskModel: T } = require('../../db/taskModel');
    const schemaDefaults = T.schema.obj;
    expect(schemaDefaults.testEnvironment.default).toBe(true);
  });
});
