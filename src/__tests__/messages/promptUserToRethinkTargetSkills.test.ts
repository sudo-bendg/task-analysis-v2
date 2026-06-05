import { promptUserToRethinkTargetSkillsMessage } from '../../messages/promptUserToRethinkTargetSkills';

describe('promptUserToRethinkTargetSkillsMessage', () => {
  it('returns a string', () => {
    const result = promptUserToRethinkTargetSkillsMessage('Leadership');
    expect(typeof result).toBe('string');
  });

  it('includes the skill name in the output', () => {
    const skill = 'Leadership';
    const result = promptUserToRethinkTargetSkillsMessage(skill);
    expect(result).toContain(skill);
  });

  it('produces different output for different skills', () => {
    const result1 = promptUserToRethinkTargetSkillsMessage('Mentoring');
    const result2 = promptUserToRethinkTargetSkillsMessage('Debugging');
    expect(result1).not.toBe(result2);
  });

  it('handles an empty string without throwing', () => {
    expect(() => promptUserToRethinkTargetSkillsMessage('')).not.toThrow();
  });

  it('suggests adding the skill to target skills', () => {
    const result = promptUserToRethinkTargetSkillsMessage('Docker');
    expect(result).toMatch(/target skill/i);
  });

  it('handles special characters in skill name', () => {
    const skill = 'C++ & Assembly';
    const result = promptUserToRethinkTargetSkillsMessage(skill);
    expect(result).toContain(skill);
  });
});
