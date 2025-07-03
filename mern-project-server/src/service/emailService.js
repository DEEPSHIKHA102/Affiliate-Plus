const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const send = async (to, subject, body) => {
    const emailOptions = {
        from: process.env.GMAIL_EMAIL_ID,
        to: to,
        subject: subject,
        text: body
    };

    await transporter.sendMail(emailOptions);
};

module.exports = send;