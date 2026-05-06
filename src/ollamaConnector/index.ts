import dotenv from 'dotenv';
import {
    findMisunderstoodPhrasesMessage,
    indentifySkillsInTaskMessage,
    identifyRelevantSupertasksMessage
} from '../messages';

dotenv.config();
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || '';
const OLLAMA_MODEL_SMALLER = process.env.OLLAMA_MODEL_SMALLER || '';
const OLLAMA_URL = process.env.OLLAMA_URL || '';
OLLAMA_MODEL_SMALLER

type OllamaResponse<T> = {
    response: T;
};

const findMisunderstoodPhrases = async <T>(task: string): Promise<T> => {
    const message = findMisunderstoodPhrasesMessage(task);

    const requestBody = {
        model: OLLAMA_MODEL,
        prompt: message,
        stream: false,
        think: false
    };

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    const modelResponse: OllamaResponse<T> = await response.json();

    return modelResponse.response;
};

const identifySkillsInTask = async <T>(task: string): Promise<T> => {
    const message = indentifySkillsInTaskMessage(task);

    const requestBody = {
        model: OLLAMA_MODEL,
        prompt: message,
        stream: false,
        think: false
    };

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    const modelResponse: OllamaResponse<T> = await response.json();

    return modelResponse.response;
};

const identifyRelevantSupertasks = async <T>(skills: string[], taskDescription: string): Promise<T> => {
    const message = identifyRelevantSupertasksMessage(skills, taskDescription);

    const requestBody = {
        model: OLLAMA_MODEL,
        prompt: message,
        stream: false,
        think: false
    };

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    const modelResponse: OllamaResponse<T> = await response.json();

    return modelResponse.response;
};

export { findMisunderstoodPhrases, identifySkillsInTask, identifyRelevantSupertasks };