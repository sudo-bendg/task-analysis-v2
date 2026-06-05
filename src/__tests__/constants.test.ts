import { AnalysisStages, relevantSkills } from '../constants';

describe('AnalysisStages', () => {
  it('has a NEW stage', () => {
    expect(AnalysisStages.NEW).toBe('NEW');
  });

  it('has a REQUIRES_CLARIFICATION stage', () => {
    expect(AnalysisStages.REQUIRES_CLARIFICATION).toBe('REQUIRES_CLARIFICATION');
  });

  it('has a REQUIRES_CONFIRMATION stage', () => {
    expect(AnalysisStages.REQUIRES_CONFIRMATION).toBe('REQUIRES_CONFIRMATION');
  });

  it('has an INITIAL_ANALYSIS_COMPLETE stage', () => {
    expect(AnalysisStages.INITIAL_ANALYSIS_COMPLETE).toBe('INITIAL_ANALYSIS_COMPLETE');
  });

  it('has a LOGGED stage', () => {
    expect(AnalysisStages.LOGGED).toBe('LOGGED');
  });

  it('has exactly 5 stages', () => {
    const keys = Object.keys(AnalysisStages).filter(k => isNaN(Number(k)));
    expect(keys).toHaveLength(5);
  });
});

describe('relevantSkills', () => {
  it('is an array', () => {
    expect(Array.isArray(relevantSkills)).toBe(true);
  });

  it('is non-empty', () => {
    expect(relevantSkills.length).toBeGreaterThan(0);
  });

  it('contains only strings', () => {
    relevantSkills.forEach(skill => {
      expect(typeof skill).toBe('string');
    });
  });

  it('contains expected core engineering skills', () => {
    expect(relevantSkills).toContain('Code implementation');
    expect(relevantSkills).toContain('Debugging');
    expect(relevantSkills).toContain('Refactoring');
  });

  it('contains expected soft skills', () => {
    expect(relevantSkills).toContain('Leadership');
    expect(relevantSkills).toContain('Mentoring');
    expect(relevantSkills).toContain('Teamwork');
  });

  it('contains expected API-related skills', () => {
    expect(relevantSkills).toContain('API design');
    expect(relevantSkills).toContain('API integration');
    expect(relevantSkills).toContain('API security');
  });

  it('contains expected security skills', () => {
    expect(relevantSkills).toContain('Secure coding');
    expect(relevantSkills).toContain('Threat modelling');
    expect(relevantSkills).toContain('Vulnerability management');
  });

  it('has no duplicate skills', () => {
    const unique = new Set(relevantSkills);
    expect(unique.size).toBe(relevantSkills.length);
  });

  it('has no empty string entries', () => {
    const empties = relevantSkills.filter(s => s.trim() === '');
    expect(empties).toHaveLength(0);
  });
});
