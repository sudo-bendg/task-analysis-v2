# Task-Analysis-V2

An AI-powered task analysis pipeline. Turn high-level descriptions of activities into data!

## About

### The problem

To be able to build skills and grow, you need to keep track of what you are doing, and know how that aligns with the skills in question. The trouble is that sitting down and listing all of the skills demontrated by a task is in itself not a quick process. Adding this admin to your own day-to-day brings enough cognative load that we often choose not to bother. The motivation for this tool then presents itself: **make the tracking of skills easy by infering them from the descriptions of tasks**.

### The solution

This pipeline achieves this goal by allowing the user to submit *only* these task descriptions, and letting an LLM extract skills which have been demonstrated in the task. At heart, that is all that is going on here.

#### Diagram

```
Telegram User
      |
      v
Telegram Bot
      |
      v
MongoDB <---- Task Pipeline ----> Ollama
      |
      v
Skill-Enriched Tasks
```

### The approach

The implementation of this pipeline can be broken into 3 steps:

1. Obtaining task descriptions
1. Turning task descriptions into skills
1. Storing skills

#### Obtaining Task Descriptions

A user can enter tasks into the pipeline using a Telegram bot. Once recieved, the task will be saved in a database.

#### Turning Task Descriptions Into Skills

When a task is ready to be analysed it is sent to an LLM. A prompt is created to ensure (ask nicely) that the response is structured nicely.

#### Storing skills

The database is updated with the skills.

## Get Started

1. Docker
    - The tool is available as a docker image at `benjamingodfrey/task-analysis-v2:latest`. Some environment variables are required. These being:
        - Some Telegram bot tokens:
            - TELEGRAM_TOKEN
            - TELEGRAM_TOKEN_TASK_RECIEVER
            - TELEGRAM_TOKEN_CLARIFICATION_REQUESTOR
            - TELEGRAM_TOKEN_FEEDBACK_BOT
        - A mongodb connection string:
            - DB_CONNECTION_STRING
        - An Ollama url:
            - OLLAMA_URL
        - Two Ollama models:
            - OLLAMA_MODEL
            - OLLAMA_MODEL_SMALLER
        - An environment:
            - ENVIRONMENT ('test', or 'prod')

1. Build it yourself
    - clone the repo
    - Create an .env file as above
    - `npx tsc -p src/tsconfig.json`
    - `npm run start`

## Example

### Input

```text
Implemented a dashboard in React for monitoring task processing statistics.
```

### Output

```json
{
  "skills": [
    "React",
    "Frontend Development",
    "Data Visualisation",
    "UI Design",
    "Problem Solving"
  ]
}
```