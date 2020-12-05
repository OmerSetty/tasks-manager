const dbHandler = require('./dbHandler');

const usersHandler = {};

usersHandler.getUserById = (id) => {
  return dbHandler.findDocumentById('user', id);   
};

module.exports = usersHandler;

