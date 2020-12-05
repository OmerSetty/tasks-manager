const dbHandler = require('./dbHandler');

const indexHandler = {};

indexHandler.register = async (user) => {
  const existingUser = await dbHandler.findDocument('user', 'email', user.email); 
  if (existingUser) return Promise.reject("there is already a user with that email");;
  return dbHandler.createDocument('user', user);
};

module.exports = indexHandler;