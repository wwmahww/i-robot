const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { db } = require('../models/botModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const dataBase =
  process.NODE_ENV === 'development' ? DB : process.env.DATABASE_LOCAL;

const dbConnect = () =>
  new Promise((resolve) => {
    mongoose
      .connect(
        dataBase,
        // process.env.DATABASE_LOCAL,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        },
        (err) => {
          if (err) {
            console.log('database error connection!', err);
          }
        }
      )
      .then(() => {
        console.log('database connect successfuly');
        resolve();
      });
  });

mongoose.connection.on('connected', function () {
  console.log('MongoDB event connected');
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB event disconnected');
  setTimeout(dbConnect, 5000);
});

module.exports = dbConnect;
