"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTaskId = generateTaskId;
exports.makeTask = makeTask;
function generateTaskId(latestId) {
    return ++latestId;
}
function makeTask(title, id) {
    const newTask = {
        id: id,
        title: title,
        completed: false,
        createdAt: Date.now(),
    };
    return newTask;
}
