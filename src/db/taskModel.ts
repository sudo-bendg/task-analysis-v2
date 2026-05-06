import mongoose, { Model, model, Schema } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const ENVIRONMENT = process.env.ENVIRONMENT;
const isTestEnvironment = (ENVIRONMENT && ENVIRONMENT === "test") ? true : false;

const taskSchema = new Schema({
    taskDescription: { type: String, requried: true },
    timeStamp: { type: Number },
    testEnvironment: { type: Boolean, default: isTestEnvironment }
});

const TaskModel = model('task', taskSchema)

export { TaskModel }