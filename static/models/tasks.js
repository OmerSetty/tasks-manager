const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const tasksSchema = new Schema ({
  team: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: `${moment().format('D.M.YYYY')}`
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'No Category'
  },
  deadline: {
    type: String,
    default: '18:00'
  },
  assignee: {
    type: String,
    default: 'Everyone'
  },
  priority: {
    type: String,
    default: 'regular'
  },
  status: {
    type: String,
    default: 'to do'
  }
});

const Task = mongoose.model('tasks', tasksSchema);
module.exports = Task;
