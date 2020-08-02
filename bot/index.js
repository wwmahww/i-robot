const web = require('./utils/interfaces');
const funs = require('./utils/indexFuns');

process.on('message', (bot) => {
  if (bot === 'finish') {
    process.send({
      pageName: web.pageName,
      decreaseTimeBy: web.quarterCounter * 900000,
    });
  } else if (bot.timeLeft === 1234567890) {
    console.log('observer');
    funs.setData(bot);
    funs.manager('observe');
    funs.observe();
    process.send(`started`);
  } else {
    console.log('sequence');
    funs.setData(bot);
    funs.setTimer(bot);
    process.send(`started`);
    funs.sequence();
    // manager('sequence');
  }
});
