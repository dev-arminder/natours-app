const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create A transporter
  // Define The email Options
  // Actually Send the email

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Arminder Singh <mail.to.arminder.singh@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
