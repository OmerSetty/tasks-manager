const dbHandler = require('./dbHandler');

const valuesHandler = {};

valuesHandler.getValues = (team) => {
  return dbHandler.findDocuments('value', {team});
};

module.exports = valuesHandler;

