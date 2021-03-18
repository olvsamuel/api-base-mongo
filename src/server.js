const bodyParser = require("body-parser");
const express = require("express");
const db = require('./config/database');

const authRoutes = require("./domains/auth/routes");
const usuarioRoutes = require("./domains/users/routes");
const externalRoutes = require("./domains/externals/routes");

//const jwtAuth = require("./middlewares/jwtAuth");
const cors = require("cors");
const server = express();
const conn = db.connection();

conn.connect();

server.use(cors());
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json({ limit: "2000kb" }));


server.use('/api/auth', authRoutes);
server.use('/api/usuarios', usuarioRoutes);
server.use('/api/externals', externalRoutes);


server.use("/api/hello", (_req, res) => {
  res.status(200).send("Hello World!");
});

module.exports = server;