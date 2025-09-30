import fs from 'node:fs';
import path from 'node:path';
import { Task, TaskId, makeTask, TaskList, generateTaskId } from './task';

export class TaskManager {
  private taskList: TaskList = TaskManager.createDefaultTaskList();
  private readonly filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), 'data', fileName);
    this.loadTasks();
  }

  private static createDefaultTaskList(): TaskList {
    return {
      latestId: 0,
      tasks: [],
    };
  }

  private loadTasks(): void {
    if (fs.existsSync(this.filePath)) {
      const fileData = fs.readFileSync(this.filePath, 'utf-8').trim();

      if (!fileData) {
        this.taskList = TaskManager.createDefaultTaskList();
        this.saveTasks();
        return;
      }

      try {
        const parsed: TaskList = JSON.parse(fileData) as TaskList;

        if (
          !Array.isArray(parsed.tasks) ||
          typeof parsed.latestId !== 'number'
        ) {
          console.warn(
            `Invalid file structure in file: ${this.filePath}. Resetting to defaults.`,
          );
          this.saveTasks();
        } else {
          this.taskList = parsed;
        }
      } catch (error) {
        console.error('Failed to parse JSON. Resetting to defaults.', error);
        this.saveTasks();
      }
    } else {
      console.warn('File not found. Creating new one.');
      this.saveTasks();
    }
  }

  private saveTasks(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.taskList, null, 2));
    } catch (error) {
      console.error('Failed to save list into file', error);
    }
  }

  addTask(title: string): Task {
    const newId = generateTaskId(this.taskList.latestId);
    this.taskList.latestId = newId;
    const newTask: Task = makeTask(title, newId);
    this.taskList.tasks.push(newTask);
    this.saveTasks();

    return newTask;
  }

  listTasks(): Task[] {
    return this.taskList.tasks;
  }

  markTaskComplete(id: TaskId): boolean {
    const taskToUpdate = this.taskList.tasks.find(
      (task: Task) => task.id === id,
    );
    if (taskToUpdate) {
      taskToUpdate.completed = true;
      this.saveTasks();
      return true;
    }
    return false;
  }

  removeTask(id: TaskId): boolean {
    const index = this.taskList.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.taskList.tasks.splice(index, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }
}
