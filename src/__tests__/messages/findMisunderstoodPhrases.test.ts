import { findMisunderstoodPhrasesMessage } from '../../messages/findMisunderstoodPhrases';

describe('findMisunderstoodPhrasesMessage', () => {
  it('returns a string', () => {
    const result = findMisunderstoodPhrasesMessage('some task');
    expect(typeof result).toBe('string');
  });

  it('includes the input task in the output', () => {
    const input = 'Deployed a Kubernetes cluster with Helm charts';
    const result = findMisunderstoodPhrasesMessage(input);
    expect(result).toContain(input);
  });

  it('instructs to reply with "None" when no clarification is needed', () => {
    const result = findMisunderstoodPhrasesMessage('any task');
    expect(result).toContain('None');
  });

  it('asks for clarification if phrases are unknown', () => {
    const result = findMisunderstoodPhrasesMessage('some task');
    expect(result).toMatch(/clarification/i);
  });

  it('produces different output for different inputs', () => {
    const result1 = findMisunderstoodPhrasesMessage('Task A');
    const result2 = findMisunderstoodPhrasesMessage('Task B');
    expect(result1).not.toBe(result2);
  });

  it('handles an empty string input without throwing', () => {
    expect(() => findMisunderstoodPhrasesMessage('')).not.toThrow();
  });

  it('handles multiline input', () => {
    const input = 'Line one\nLine two\nLine three';
    const result = findMisunderstoodPhrasesMessage(input);
    expect(result).toContain(input);
  });
});
