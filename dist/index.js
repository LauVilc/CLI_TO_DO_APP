"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
const readline_1 = __importDefault(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
console.clear();
const taskLists = (0, utils_1.loadAllTaskLists)();
let currentListName = Object.keys(taskLists)[0];
let currentManager = taskLists[currentListName];
const infoMessageColor = chalk_1.default.bold.grey;
const warnMessageColor = chalk_1.default.bold.bgYellow.black;
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
console.log(chalk_1.default.grey('App was started, for command list type "help"'));
rl.on('line', (input) => {
    const [command, ...args] = input.trim().split(' ');
    switch (command) {
        case 'switch-list':
            if (args.length === 1) {
                const newListName = args[0];
                if (taskLists[newListName]) {
                    currentListName = newListName;
                    currentManager = taskLists[newListName];
                    console.log(infoMessageColor(`switched to list "${newListName}"`));
                }
                else {
                    console.log(warnMessageColor(`list "${newListName}" does not exist`));
                }
            }
            else {
                console.log(warnMessageColor('usage: switch <listName>'));
            }
            break;
        case 'todo-lists':
            console.log(infoMessageColor('available lists:'));
            Object.keys(taskLists).forEach((name) => {
                if (name === currentListName) {
                    console.log(chalk_1.default.green(`* ${name}`));
                }
                else {
                    console.log(`  ${name}`);
                }
            });
            break;
        case 'add':
            currentManager.addTask(args.join(' '));
            console.log(infoMessageColor('new task was added to the list'));
            break;
        case 'list':
            console.clear();
            (0, utils_1.printTaskTable)(currentManager.listTasks());
            console.log(infoMessageColor('enter command. For command list type "help"'));
            break;
        case 'complete':
            if (args.length === 1) {
                currentManager.markTaskComplete(Number(args[0]))
                    ? console.log(infoMessageColor('task completion updated'))
                    : console.log(infoMessageColor("couldn't find this task"));
                break;
            }
            console.log(warnMessageColor('enter only 1 id at a time'));
            break;
        case 'remove':
            if (args.length === 1) {
                currentManager.removeTask(Number(args[0]))
                    ? console.log(infoMessageColor('task removed'))
                    : console.log(warnMessageColor("couldn't find this task"));
                break;
            }
            console.log(warnMessageColor('enter only 1 id at a time'));
            break;
        case 'help':
            console.log(infoMessageColor('available commands:'));
            console.log(infoMessageColor('todo-lists - list of all available to-do lists'));
            console.log(infoMessageColor('switch-list <title> - switches which list is going to be edited'));
            console.log(infoMessageColor('add <title> - adds item with <title> into to-do list'));
            console.log(infoMessageColor('list - lists items in to-do list currently'));
            console.log(infoMessageColor('complete <ID> - completes to-do list item'));
            console.log(infoMessageColor('remove <ID> - deletes to-do list item'));
            console.log(infoMessageColor('exit - closes app'));
            break;
        case 'exit':
            rl.close();
            console.log(infoMessageColor('App was closed, goodbye!'));
            break;
        default:
            console.log(infoMessageColor('Unknown command. For command list type "help"'));
    }
});
