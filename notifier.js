const nodemailer = require('nodemailer');

class Notifier {
    constructor() {
    }

    /**
     * Example: {"from": "someemail@blah.com", "to":"anotheremail.@blah.com", "subject" : "Some Subject", "body" : "Some Body" }
     */
    sendEmail(emailOptions, callback) {

        const email = process.env.EMAIL;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: emailOptions.from,
            to: emailOptions.to,
            subject: emailOptions.subject,
            text: emailOptions.body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                callback(error);
            } else {
                console.log('Email sent: ' + info.response);
                callback();
            }
        });
    }
}

module.exports = Notifier;