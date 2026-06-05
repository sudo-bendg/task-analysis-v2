const mockFetch = jest.fn();
global.fetch = mockFetch;

const makeFetchResponse = (responseText: string) =>
  Promise.resolve({
    json: () => Promise.resolve({ response: responseText }),
  } as Response);

describe('ollamaConnector', () => {
  let findMisunderstoodPhrases: (task: string) => Promise<any>;
  let identifySkillsInTask: (task: string) => Promise<any>;
  let identifyRelevantSupertasks: (skills: string[], task: string) => Promise<any>;

  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
    process.env.OLLAMA_URL = 'http://ollama-host:11434';
    process.env.OLLAMA_MODEL = 'llama3';
    process.env.OLLAMA_MODEL_SMALLER = 'llama3-small';

    const connector = require('../ollamaConnector');
    findMisunderstoodPhrases = connector.findMisunderstoodPhrases;
    identifySkillsInTask = connector.identifySkillsInTask;
    identifyRelevantSupertasks = connector.identifyRelevantSupertasks;
  });

  describe('findMisunderstoodPhrases', () => {
    it('calls the Ollama /api/generate endpoint', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      await findMisunderstoodPhrases('some task');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.any(Object)
      );
    });

    it('uses the correct HTTP method and content-type', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      await findMisunderstoodPhrases('some task');
      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
    });

    it('sends the correct model in the request body', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      await findMisunderstoodPhrases('some task');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.model).toBe('llama3');
    });

    it('sends stream: false and think: false', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      await findMisunderstoodPhrases('some task');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.stream).toBe(false);
      expect(body.think).toBe(false);
    });

    it('returns the response field from the Ollama JSON response', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      const result = await findMisunderstoodPhrases('some task');
      expect(result).toBe('None');
    });

    it('returns clarification text when model responds with one', async () => {
      const clarification = 'Please clarify what "K8s" means';
      mockFetch.mockReturnValue(makeFetchResponse(clarification));
      const result = await findMisunderstoodPhrases('Deployed to K8s');
      expect(result).toBe(clarification);
    });

    it('includes the task in the prompt sent to Ollama', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      const task = 'My unique task description XYZ';
      await findMisunderstoodPhrases(task);
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.prompt).toContain(task);
    });

    it('uses the OLLAMA_URL from environment', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('None'));
      await findMisunderstoodPhrases('task');
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('http://ollama-host:11434');
    });
  });

  describe('identifySkillsInTask', () => {
    it('calls the Ollama /api/generate endpoint', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('TypeScript, Testing'));
      await identifySkillsInTask('Wrote unit tests in TypeScript');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.any(Object)
      );
    });

    it('returns the response field from the Ollama JSON response', async () => {
      const expected = 'React, Frontend Development, UI Design';
      mockFetch.mockReturnValue(makeFetchResponse(expected));
      const result = await identifySkillsInTask('Built a dashboard in React');
      expect(result).toBe(expected);
    });

    it('sends stream: false and think: false', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      await identifySkillsInTask('some task');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.stream).toBe(false);
      expect(body.think).toBe(false);
    });

    it('sends the correct model in the request body', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      await identifySkillsInTask('some task');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.model).toBe('llama3');
    });

    it('includes the task in the prompt sent to Ollama', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      const task = 'Unique task ABCDEF';
      await identifySkillsInTask(task);
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.prompt).toContain(task);
    });

    it('handles "none" response from model', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      const result = await identifySkillsInTask('an unintelligible task');
      expect(result).toBe('none');
    });
  });

  describe('identifyRelevantSupertasks', () => {
    it('calls the Ollama /api/generate endpoint', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('Code implementation, Debugging'));
      await identifyRelevantSupertasks(['TypeScript'], 'Fixed a bug');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.any(Object)
      );
    });

    it('returns the response field from the Ollama JSON response', async () => {
      const expected = 'API design, API integration';
      mockFetch.mockReturnValue(makeFetchResponse(expected));
      const result = await identifyRelevantSupertasks(['REST', 'Node.js'], 'Built an API');
      expect(result).toBe(expected);
    });

    it('sends the correct model in the request body', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      await identifyRelevantSupertasks(['skill'], 'task');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.model).toBe('llama3');
    });

    it('includes skills in the prompt sent to Ollama', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      const skills = ['Docker', 'CI/CD'];
      await identifyRelevantSupertasks(skills, 'Deployed service');
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      skills.forEach(skill => expect(body.prompt).toContain(skill));
    });

    it('includes the task description in the prompt sent to Ollama', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      const taskDescription = 'Deployed to production using Kubernetes';
      await identifyRelevantSupertasks(['Docker'], taskDescription);
      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.prompt).toContain(taskDescription);
    });

    it('handles "none" response from model', async () => {
      mockFetch.mockReturnValue(makeFetchResponse('none'));
      const result = await identifyRelevantSupertasks([], 'task');
      expect(result).toBe('none');
    });
  });
});
