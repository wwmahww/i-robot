const web = require('./interfaces');
const index = require('../index');
const sendEmail = require('../../utils/email');

module.exports = (fn) => {
  return (...args) => {
    fn(...args).catch(async (err) => {
      const { message } = err;
      console.log('error: ', err);
      await sendEmail({
        email: 'amirtnt80@yahoo.com',
        subject: `error in ${web.turn}`,
        message,
      });
    });
  };
};
