"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const task_1 = require("./task");
class TaskManager {
    constructor(fileName) {
        this.taskList = TaskManager.createDefaultTaskList();
        this.filePath = node_path_1.default.join(process.cwd(), 'data', fileName);
        this.loadTasks();
    }
    static createDefaultTaskList() {
        return {
            latestId: 0,
            tasks: [],
        };
    }
    loadTasks() {
        if (node_fs_1.default.existsSync(this.filePath)) {
            const fileData = node_fs_1.default.readFileSync(this.filePath, 'utf-8').trim();
            if (!fileData) {
                this.taskList = TaskManager.createDefaultTaskList();
                this.saveTasks();
                return;
            }
            try {
                const parsed = JSON.parse(fileData);
                if (!Array.isArray(parsed.tasks) ||
                    typeof parsed.latestId !== 'number') {
                    console.warn(`Invalid file structure in file: ${this.filePath}. Resetting to defaults.`);
                    this.saveTasks();
                }
                else {
                    this.taskList = parsed;
                }
            }
            catch (error) {
                console.error('Failed to parse JSON. Resetting to defaults.', error);
                this.saveTasks();
            }
        }
        else {
            console.warn('File not found. Creating new one.');
            this.saveTasks();
        }
    }
    saveTasks() {
        try {
            node_fs_1.default.writeFileSync(this.filePath, JSON.stringify(this.taskList, null, 2));
        }
        catch (error) {
            console.error('Failed to save list into file', error);
        }
    }
    addTask(title) {
        const newId = (0, task_1.generateTaskId)(this.taskList.latestId);
        this.taskList.latestId = newId;
        const newTask = (0, task_1.makeTask)(title, newId);
        this.taskList.tasks.push(newTask);
        this.saveTasks();
        return newTask;
    }
    listTasks() {
        return this.taskList.tasks;
    }
    markTaskComplete(id) {
        const taskToUpdate = this.taskList.tasks.find((task) => task.id === id);
        if (taskToUpdate) {
            taskToUpdate.completed = true;
            this.saveTasks();
            return true;
        }
        return false;
    }
    removeTask(id) {
        const index = this.taskList.tasks.findIndex((task) => task.id === id);
        if (index !== -1) {
            this.taskList.tasks.splice(index, 1);
            this.saveTasks();
            return true;
        }
        return false;
    }
}
exports.TaskManager = TaskManager;
