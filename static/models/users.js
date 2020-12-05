const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema ({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  groupBy:{
    type: String,
    default: 'category'
  },
  groupBy:{
    type: String,
    default: 'category'
  },
  team:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('users', usersSchema);
module.exports = User;
