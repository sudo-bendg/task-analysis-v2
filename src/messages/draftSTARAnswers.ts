const draftSTARAnswersMessage = (task: string, skill: string): string => {
  return `You are a senior career and skills coach, with a focus on the technology industry. Draft a STAR (Situation, Task, Action, Response) style interview question answer which demostrates how the skill "${skill}" is demonstrated in the task:\n"""\n${task}"""`;
};

export { draftSTARAnswersMessage };
