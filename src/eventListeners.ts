import { EventEmitter } from 'events';
import { TaskModel } from './db/taskModel';
import { AnalysisStages } from './constants';
import { identifyRelevantSupertasks, identifySkillsInTask } from './ollamaConnector';
import { ClarificationRequestorBot } from "./bots";

const TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR = process.env.TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR || "";
const clarificationRequestorBot = new ClarificationRequestorBot(TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR)

const globalEventListener = new EventEmitter();

globalEventListener.on("Task Recieved", async () => {
  try {
    const newTasks = await TaskModel.find({
      $or: [{ 'status': AnalysisStages.NEW }, { 'status': AnalysisStages.REQUIRES_CLARIFICATION }]
    }).exec();

    for (const task of newTasks) {
    if (task.status === AnalysisStages.REQUIRES_CLARIFICATION) {

      clarificationRequestorBot.requestClarification(task.taskDescription || '', task.fromUser || -1)

    } else {

      const skillsString: string = await identifySkillsInTask(task.taskDescription || '');
      const skillsArray = skillsString.split(',')
      skillsArray.map(skill => skill.trim());

      const superSkillsString: string = await identifyRelevantSupertasks(skillsArray, task.taskDescription || '')
      const superSkillsArray = superSkillsString.split(',')
      superSkillsArray.map(skill => skill.trim());

      await TaskModel.updateOne({ _id: task._id }, { skills: skillsArray.concat(superSkillsArray), status: AnalysisStages.INITIAL_ANALYSIS_COMPLETE })
    }
  }
  } catch (err) {
    throw new Error(`Error thrown in globalEventListener. Err: ${err}`);
  }
});