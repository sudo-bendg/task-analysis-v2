import { relevantSkills } from "../../constants";

const identifyRelevantSupertasksMessage = (input: string[]): string => {
  return `You are a senior career and skills coach, with a focus on the technology industry. The following skills have been identified in a task carried out by a client:\n\n${input.join("\n")}\n\nThis client has specified that the skills which they actively want to build are:\n\n${relevantSkills.join("\n")}\n\nIdentify which of their chosen skills are fulfilled by the sub-skills identified in the task. Note that it is possible for one of these skills to be one of the sub-skills. In this case, the sub-skill is fulfilled\n\nReturn just a comma-seperated list of the skills which you have identified. If no skills are identified, simply return the word "none".`;
};

export { identifyRelevantSupertasksMessage };
