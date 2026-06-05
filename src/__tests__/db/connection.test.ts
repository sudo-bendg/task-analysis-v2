import { getConnection } from '../../db/ connection';

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

import mongoose from 'mongoose';

describe('getConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls mongoose.connect with the provided connection string', async () => {
    const connectionString = 'mongodb://localhost:27017/testdb';
    await getConnection(connectionString);
    expect(mongoose.connect).toHaveBeenCalledWith(connectionString);
  });

  it('calls mongoose.connect exactly once', async () => {
    await getConnection('mongodb://localhost:27017/testdb');
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('resolves without throwing when connect succeeds', async () => {
    await expect(getConnection('mongodb://localhost:27017/testdb')).resolves.toBeUndefined();
  });

  it('throws when mongoose.connect rejects', async () => {
    const connectError = new Error('Connection refused');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(connectError);
    await expect(getConnection('mongodb://bad-host/db')).rejects.toThrow('Connection refused');
  });

  it('passes an empty string when no connection string is given', async () => {
    await getConnection('');
    expect(mongoose.connect).toHaveBeenCalledWith('');
  });
});
