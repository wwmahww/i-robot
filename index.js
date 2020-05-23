const dbConnect = require('./utils/databaseConnection');
const server = require('./server');
const botLauncher = require('./utils/botLauncher');

(async () => {
  await dbConnect();
  await botLauncher.launcher();
  server.start();
})();
