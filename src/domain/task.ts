export type TaskId = number;

export interface TaskList {
  latestId: TaskId;
  tasks: Task[];
}

export interface Task {
  id: TaskId;
  title: string;
  completed: boolean;
  createdAt: number;
}

export function generateTaskId(latestId: TaskId): TaskId {
  return ++latestId;
}

export function makeTask(title: string, id: TaskId): Task {
  const newTask: Task = {
    id: id,
    title: title,
    completed: false,
    createdAt: Date.now(),
  };

  return newTask;
}
