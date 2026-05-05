const findMisunderstoodPhrasesMessage = (input: string): string => {
    return `You are going to analyse a user-submitted task, identify skills involved in that task, and provide feedback to the user. A description of the task is stated below. Read this description and identify any unknown words or phrases before analysis starts. If you require clarification or definition, prepare a response for the user stating clarification required. If no clarification or definition is required, simply reply with the word "None".\nUser submitted task description:\n"""\n${input}\n"""`;
}

export { findMisunderstoodPhrasesMessage };