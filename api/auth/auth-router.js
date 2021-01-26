const express = require("express");
const User = require("../users/users-model.js");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password } = req.body
  const hashed = bcrypt.hashSync(password, 10) 
  User.add({ username, password: hashed, role: 2 })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const allegedUser = await User.findBy({ username }).first()
    if (allegedUser && bcrypt.compareSync(password, allegedUser.password)) {
      req.session.user = allegedUser
      res.json('welcome back')
    } else {
      res.status(401).json('invalid credentials')
    }
  } catch (err) {
    res.status(500).json(err.message)
  }
});

router.get('/logout', (req, res) => {
  if(req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json(err.message);
      } else {
        res.json('Thanks for coming!');
      }
    })
  } else {
    res.status(500).json("something went wrong!")
  }
});

module.exports = router;
