const express = require('express');
const router = express.Router();
const path = require('path');
const Task = require('../static/models/tasks');
const mainHandler = require('../handlers/mainHandler');
const usersHandler = require('../handlers/usersHandler');
const valuesHandler = require('../handlers/valuesHandler');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../pages/main.html'));
});

router.get('/getTasksOfDay', async (req, res) => {
  try {
    const userData = await usersHandler.getUserById(req.query.userId);
    const [tasksOfDay, values] = await Promise.all([mainHandler.getTasksOfDay(req.query.date, userData.team), valuesHandler.getValues(userData.team)]);
    const user = {
      username: userData.username,
      groupBy: userData.groupBy,
      team: userData.team,
      isAdmin: userData.isAdmin
    };
    res.send({tasksOfDay, values, user});
  }
  catch (err) {
    res.status(404).send(err);
  }
});

router.post('/addTask', async (req, res) => {
  try {
    const result = await mainHandler.addTask(req.body);
    res.send(result);
  }
  catch (err) {
    res.status(404).send("no data found");
  }
});

router.post('/updateTask', async (req, res) => {
  try {
    const result = await mainHandler.updateTask(req.body);
    res.send(result); 
  }
  catch (err) {
    res.status(404).send("no data found");
  }
});

router.post('/deleteTask', async (req, res) => {
  try {
    const result = await mainHandler.deleteTask(req.body);
    res.send(result); 
  }
  catch (err) {
    res.status(404).send("no data found");
  }
});

router.post('/changeGroupBy', async (req, res) => {
  try {
    const result = await mainHandler.changeGroupBy(req.body);
    res.send(result); 
  }
  catch (err) {
    res.status(404).send("no data found");
  }
});

module.exports = router;