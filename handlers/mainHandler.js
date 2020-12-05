const dbHandler = require('./dbHandler');


const mainHandler = {};

mainHandler.getTasksOfDay = (date, team) => {
  return dbHandler.findDocuments('task', {date, team});
};

mainHandler.addTask = (data) => {
  return dbHandler.createDocument('task', data);
};

mainHandler.updateTask = (updatedTask) => {
  console.log(updatedTask);
  return dbHandler.findDocumentByIdAndUpdate('task', updatedTask.taskId, updatedTask.update);
};

mainHandler.deleteTask = (data) => {
  return dbHandler.deleteDocumentById('task', data.id);
};

mainHandler.changeGroupBy = (updatedGroupBy) => {
  return dbHandler.findDocumentByIdAndUpdate('user', updatedGroupBy.id, updatedGroupBy.update);
};

module.exports = mainHandler;