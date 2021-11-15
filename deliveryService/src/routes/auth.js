const express = require('express');
const passport = require('passport');
const UserModule = require('../controller/UserModule');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {
    email,
    password,
    name,
    contactPhone,
  } = req.body;
  try {
    const data = await UserModule.create({
      email, password, name, contactPhone,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
});

router.post('/signin', passport.authenticate('local',
  {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/error',
  }));

router.get('/auth/success', (req, res) => {
  res.json({
    data: req.user,
    status: 'ok',
  });
});

router.get('/auth/error', (req, res) => {
  res.json({
    error: 'Неверный логин или пароль',
    status: 'error',
  });
});

module.exports = router;
