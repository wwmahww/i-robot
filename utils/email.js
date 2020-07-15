const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'amirtnt80@gmail.com',
      pass: 'thg@ma!l.1',
      // user: process.env.EMAIL_USERNAME,
      // pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
  });
  // 2) Define the email options
  const mailOpions = {
    from: 'i-robot <amirtnt80@gmail.com',
    to: 'amir.rahmani.dev@gmail.com',
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  transporter.sendMail(mailOpions, (err, data) => {
    if (err) {
      console.log('error in sending email: ', err);
    }
    console.log('email has send successfully');
    console.log(data);
  });
};

module.exports = sendEmail;
