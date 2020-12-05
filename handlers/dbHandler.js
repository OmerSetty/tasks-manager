const User = require('../static/models/users');
const Task = require('../static/models/tasks');
const Value = require('../static/models/values');
const { query } = require('express');

const COLLECTIONS = {
  user: User,
  task: Task,
  value: Value
};

const dbHandler = {};

dbHandler.createDocument = (collection, document) => {
  return COLLECTIONS[collection].create(document); 
};

dbHandler.deleteDocumentById = (collection, id) => {
  return COLLECTIONS[collection].findByIdAndRemove({_id: id});
};

dbHandler.findDocument = (collection, key, value) => {
  return COLLECTIONS[collection].findOne({[key]: value});
};

dbHandler.findDocuments = (collection, query) => {
  console.log(query);
  return COLLECTIONS[collection].find(query);
};

dbHandler.findAllDocuments = (collection) => {
  return COLLECTIONS[collection].find();
};

dbHandler.findDocumentById = (collection, id) => {
  return COLLECTIONS[collection].findById(id);
};

dbHandler.findDocumentByIdAndUpdate = (collection, id, update) => {
  return COLLECTIONS[collection].findByIdAndUpdate(id, update);
};

module.exports = dbHandler;


