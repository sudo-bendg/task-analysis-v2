import { indentifySkillsInTaskMessage } from '../../messages/identifySkillsInTask';

describe('indentifySkillsInTaskMessage', () => {
  it('returns a string', () => {
    const result = indentifySkillsInTaskMessage('Built a feature');
    expect(typeof result).toBe('string');
  });

  it('includes the input task in the output', () => {
    const input = 'Refactored a legacy authentication module in Python';
    const result = indentifySkillsInTaskMessage(input);
    expect(result).toContain(input);
  });

  it('instructs to return a comma-separated list', () => {
    const result = indentifySkillsInTaskMessage('any task');
    expect(result).toMatch(/comma[\s-]sep/i);
  });

  it('instructs to return "none" when no skills are identified', () => {
    const result = indentifySkillsInTaskMessage('any task');
    expect(result).toMatch(/none/i);
  });

  it('mentions both hard and soft skills', () => {
    const result = indentifySkillsInTaskMessage('any task');
    expect(result).toMatch(/hard skill/i);
    expect(result).toMatch(/soft skill/i);
  });

  it('produces different output for different inputs', () => {
    const result1 = indentifySkillsInTaskMessage('Wrote a unit test');
    const result2 = indentifySkillsInTaskMessage('Deployed to production');
    expect(result1).not.toBe(result2);
  });

  it('handles an empty string input without throwing', () => {
    expect(() => indentifySkillsInTaskMessage('')).not.toThrow();
  });

  it('wraps the input in triple quotes', () => {
    const input = 'my task description';
    const result = indentifySkillsInTaskMessage(input);
    expect(result).toContain(`"""${input}"""`);
  });
});
