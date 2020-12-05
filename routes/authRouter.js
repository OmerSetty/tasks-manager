const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const initializePassport = require('../passport-init');
const flash = require('connect-flash');
const session = require('express-session');

initializePassport(passport);

router.use(flash());
router.use(session({
  secret: 'anything',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());


router.get('/', checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '/../pages/index.html'));
});

router.get('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/faliureLogin',
  failureFlash: true
}));

router.get('/getLoggedUserId', async (req, res) => {
  return req.session.passport.user === undefined ? res.json({}) : res.json({'userId': req.session.passport.user});
});

router.get('/masin', checkAuthenticated, async (req, res) => {
  res.sendFile(path.join(__dirname, '/../pages/main.html'));
});

router.get('/faliureLogin', checkNotAuthenticated, (req, res) => {
  res.status(401).send(req.flash('error')[0]);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("is authenticated");
    return next();
  }
  console.log("is not authenticated");
  res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("is authenticated");
    return res.redirect('/main');
  }
  console.log("is not authenticated");
  next();
}

router.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;