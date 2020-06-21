const dotenv = require('dotenv');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('unhandled rejection! 💥 shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

//  START SERVER
let server;
const port = process.env.NODE_ENV === 'development' ? 3000 : 80;
exports.start = () => {
  server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('unhandled rejection! 💥 shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
