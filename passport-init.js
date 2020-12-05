const localStrategy = require('passport-local').Strategy;
const dbHandler = require('./handlers/dbHandler');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    let user = await dbHandler.findDocument('user', 'email', email);
    if (user == null) {
      return done(null, false, { message: 'No user with that email'});
    }
    
    try {
      if (password == user.password) {
        return done(null, user);
      }
      else {
        return done(null, false, { message: 'The password is incorrect'});
      } 
    }
    catch (err) {
      return done(err);
    }
    
  };

  passport.use(new localStrategy({
    usernameField: 'email',
  }, authenticateUser));
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    return done(null, dbHandler.findDocument('user', 'id', id));
  });  
}

module.exports = initialize;