import { Task } from '../domain/task';
import chalk from 'chalk';
import stringWidth from 'string-width';
import { TaskManager } from '../domain/taskManager';
import fs from 'node:fs';
import path from 'node:path';

export function printTaskTable(data: Task[]) {
  const rowStyles = [chalk.bgBlack, chalk.bgGray];
  const headerStyle = chalk.bgBlue.underline;
  const titleWidth = collumnWidth(data, 'title');
  const idWidth = collumnWidth(data, 'id');
  let listNumber = 1;

  const headers = headerStyle(
    `${padEndVisible('', 3)} | ` +
      `${padEndVisible('Title', titleWidth > 10 ? titleWidth : 10)} | ` +
      `${padEndVisible('Completed', 9)} | ` +
      `${centerText('Item ID', idWidth > 7 ? idWidth : 7)} | ` +
      `${padEndVisible('Created', 20)}`,
  );

  console.log(
    headerStyle(
      centerText(chalk.underline('TO DO LIST'), stringWidth(headers)),
    ),
  );
  console.log(headers);
  data.forEach((task: Task, index) => {
    const lineColor = rowStyles[index % rowStyles.length];

    console.log(
      lineColor(
        `${padEndVisible(listNumber.toString(), 3)} | ` +
          `${padEndVisible(task.title, titleWidth > 10 ? titleWidth : 10)} | ` +
          `${centerText(task.completed ? chalk.bold.green('✓') : chalk.bold.red('✗'), 9)} | ` +
          `${centerText(task.id.toString(), idWidth > 7 ? idWidth : 7)} | ` +
          `${padEndVisible(new Date(task.createdAt).toLocaleString(), 20)}`,
      ),
    );
    listNumber++;
  });
}

function centerText(text: string, width: number, fill: string = ' ') {
  const visibleLength = stringWidth(text);
  const left = Math.floor((width - visibleLength) / 2);
  const right = width - visibleLength - left;
  return fill.repeat(left) + text + fill.repeat(right);
}

function padEndVisible(text: string, width: number, fill: string = ' ') {
  const visibleLength = stringWidth(text);
  const padding = width - visibleLength;
  return text + fill.repeat(Math.max(0, padding));
}

interface TaskManagerMap {
  [key: string]: TaskManager;
}

export function loadAllTaskLists() {
  const dir = path.join(process.cwd(), 'data');
  const managers: TaskManagerMap = {};

  if (!fs.existsSync(dir)) return managers;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const listName = path.basename(file, '.json');
    managers[listName] = new TaskManager(file);
  }

  return managers;
}

function collumnWidth(tasks: Task[], collumn: keyof Task) {
  return Math.max(
    ...tasks.map((task: Task) => {
      return task[collumn].toString().length;
    }),
  );
}
