const express = require("express");
const session = require("express-session");
const cors = require("cors");
const KnexSessionStore = require("connect-session-knex")(session)

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const server = express();

server.use(express.json());
server.use(cors());
server.use(session({
  name: "Lebron",
  secret: "kyrie is better than steph",
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false, 
    httpOnly: true,
  },
  resave: false, 
  saveUninitialized: false, 
  store: new KnexSessionStore({
    knex: require('../data/connection.js'),
    tablename: 'cleveland',
    sidfieldname: 'cavs', 
    createtable: true, 
    clearInterval: 1000 * 60 * 30,
  }),
}))

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
