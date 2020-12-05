const express = require('express');
const router = express.Router();
const indexHandler = require('../handlers/indexHandler');
const url = require('url');


router.post('/', async (req, res) => {
  try {
    const user = await indexHandler.register(req.body);
    const userData = {
      email: user.email,
      password: user.password
    }

    res.redirect(url.format({
      pathname: 'login',
      query: userData
    }));

  }
  catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

module.exports = router;