const promptUserToRethinkTargetSkillsMessage = (skill: string): string => {
  return `It looks like you have gained a good amount of experience in the skill "${skill}", but this is not in your target skills. Have a think, and add this to your target skills if it is relevant!`;
};

export { promptUserToRethinkTargetSkillsMessage };
