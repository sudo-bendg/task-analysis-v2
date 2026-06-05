import { draftSTARAnswersMessage } from '../../messages/draftSTARAnswers';

describe('draftSTARAnswersMessage', () => {
  it('returns a string', () => {
    const result = draftSTARAnswersMessage('Built an API', 'API design');
    expect(typeof result).toBe('string');
  });

  it('includes the skill in the output', () => {
    const skill = 'API design';
    const result = draftSTARAnswersMessage('Built an API', skill);
    expect(result).toContain(skill);
  });

  it('includes the task description in the output', () => {
    const task = 'Built an API in Node.js';
    const result = draftSTARAnswersMessage(task, 'API design');
    expect(result).toContain(task);
  });

  it('mentions STAR in the prompt', () => {
    const result = draftSTARAnswersMessage('some task', 'some skill');
    expect(result).toMatch(/STAR/i);
  });

  it('produces different output for different skills', () => {
    const task = 'Implemented authentication';
    const result1 = draftSTARAnswersMessage(task, 'Security');
    const result2 = draftSTARAnswersMessage(task, 'Backend development');
    expect(result1).not.toBe(result2);
  });

  it('produces different output for different tasks', () => {
    const skill = 'Problem solving';
    const result1 = draftSTARAnswersMessage('Fixed a bug', skill);
    const result2 = draftSTARAnswersMessage('Designed a system', skill);
    expect(result1).not.toBe(result2);
  });

  it('handles empty strings without throwing', () => {
    expect(() => draftSTARAnswersMessage('', '')).not.toThrow();
  });

  it('handles special characters in task and skill', () => {
    const result = draftSTARAnswersMessage('Task with "quotes"', 'Skill & more');
    expect(result).toContain('Task with "quotes"');
    expect(result).toContain('Skill & more');
  });
});
