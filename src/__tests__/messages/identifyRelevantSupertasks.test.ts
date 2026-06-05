import { identifyRelevantSupertasksMessage } from '../../messages/identifyRelevantSupertasks';
import { relevantSkills } from '../../constants';

describe('identifyRelevantSupertasksMessage', () => {
  const sampleSkills = ['TypeScript', 'REST API', 'Testing'];
  const sampleTask = 'Implemented a REST API with TypeScript and wrote unit tests';

  it('returns a string', () => {
    const result = identifyRelevantSupertasksMessage(sampleSkills, sampleTask);
    expect(typeof result).toBe('string');
  });

  it('includes all provided skills in the output', () => {
    const result = identifyRelevantSupertasksMessage(sampleSkills, sampleTask);
    sampleSkills.forEach(skill => {
      expect(result).toContain(skill);
    });
  });

  it('includes the task description in the output', () => {
    const result = identifyRelevantSupertasksMessage(sampleSkills, sampleTask);
    expect(result).toContain(sampleTask);
  });

  it('includes the relevant skills from constants', () => {
    const result = identifyRelevantSupertasksMessage(sampleSkills, sampleTask);
    relevantSkills.slice(0, 3).forEach(skill => {
      expect(result).toContain(skill);
    });
  });

  it('instructs to return "none" when no skills match', () => {
    const result = identifyRelevantSupertasksMessage([], 'task');
    expect(result).toMatch(/none/i);
  });

  it('instructs to return a comma-separated list', () => {
    const result = identifyRelevantSupertasksMessage(sampleSkills, sampleTask);
    expect(result).toMatch(/comma[\s-]sep/i);
  });

  it('handles an empty skills array without throwing', () => {
    expect(() => identifyRelevantSupertasksMessage([], sampleTask)).not.toThrow();
  });

  it('handles a single skill', () => {
    const result = identifyRelevantSupertasksMessage(['Docker'], sampleTask);
    expect(result).toContain('Docker');
  });

  it('produces different output for different skill sets', () => {
    const result1 = identifyRelevantSupertasksMessage(['React'], sampleTask);
    const result2 = identifyRelevantSupertasksMessage(['Python'], sampleTask);
    expect(result1).not.toBe(result2);
  });
});
