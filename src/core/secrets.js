const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  IS_PROD: process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() === "production" : false,
  JWT_SECRET: process.env.JWT_SECRET,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  CONN_STRING: process.env.CONN_STRING,
  
  MONGO_CONN_STRING: process.env.MONGO_CONN_STRING,
  MONGO_CONN: "mongodb",
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PORT: process.env.PORT,
  MONGO_PWD: process.env.MONGO_PWD,
  MONGO_NAME: process.env.MONGO_NAME,
  MONGO_HOST: process.env.MONGO_HOST,

  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
    PWD: process.env.SMTP_PWD,
    FROM: process.env.SMTP_FROM
  }
};
