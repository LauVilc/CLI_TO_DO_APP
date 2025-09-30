"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printTaskTable = printTaskTable;
exports.loadAllTaskLists = loadAllTaskLists;
const chalk_1 = __importDefault(require("chalk"));
const string_width_1 = __importDefault(require("string-width"));
const taskManager_1 = require("../domain/taskManager");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function printTaskTable(data) {
    const rowStyles = [chalk_1.default.bgBlack, chalk_1.default.bgGray];
    const headerStyle = chalk_1.default.bgBlue.underline;
    const titleWidth = collumnWidth(data, 'title');
    const idWidth = collumnWidth(data, 'id');
    let listNumber = 1;
    const headers = headerStyle(`${padEndVisible('', 3)} | ` +
        `${padEndVisible('Title', titleWidth > 10 ? titleWidth : 10)} | ` +
        `${padEndVisible('Completed', 9)} | ` +
        `${centerText('Item ID', idWidth > 7 ? idWidth : 7)} | ` +
        `${padEndVisible('Created', 20)}`);
    console.log(headerStyle(centerText(chalk_1.default.underline('TO DO LIST'), (0, string_width_1.default)(headers))));
    console.log(headers);
    data.forEach((task, index) => {
        const lineColor = rowStyles[index % rowStyles.length];
        console.log(lineColor(`${padEndVisible(listNumber.toString(), 3)} | ` +
            `${padEndVisible(task.title, titleWidth > 10 ? titleWidth : 10)} | ` +
            `${centerText(task.completed ? chalk_1.default.bold.green('✓') : chalk_1.default.bold.red('✗'), 9)} | ` +
            `${centerText(task.id.toString(), idWidth > 7 ? idWidth : 7)} | ` +
            `${padEndVisible(new Date(task.createdAt).toLocaleString(), 20)}`));
        listNumber++;
    });
}
function centerText(text, width, fill = ' ') {
    const visibleLength = (0, string_width_1.default)(text);
    const left = Math.floor((width - visibleLength) / 2);
    const right = width - visibleLength - left;
    return fill.repeat(left) + text + fill.repeat(right);
}
function padEndVisible(text, width, fill = ' ') {
    const visibleLength = (0, string_width_1.default)(text);
    const padding = width - visibleLength;
    return text + fill.repeat(Math.max(0, padding));
}
function loadAllTaskLists() {
    const dir = node_path_1.default.join(process.cwd(), 'data');
    const managers = {};
    if (!node_fs_1.default.existsSync(dir))
        return managers;
    const files = node_fs_1.default.readdirSync(dir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
        const listName = node_path_1.default.basename(file, '.json');
        managers[listName] = new taskManager_1.TaskManager(file);
    }
    return managers;
}
function collumnWidth(tasks, collumn) {
    return Math.max(...tasks.map((task) => {
        return task[collumn].toString().length;
    }));
}
