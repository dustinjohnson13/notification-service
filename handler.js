'use strict';

const Notifier = require('./notifier');

let notifier = new Notifier();

// Example invocation:
// curl -X 'POST' <url> -H 'Content-Type: application/json' -d '{"email": {"from": "someemail@blah.com", "to":"anotheremail.@blah.com", "subject" : "Some Subject", "body" : "Some Body" } }'
//
// Through API Gateway:
// curl -H 'Content-Type: application/json' -H 'x-api-key: <key>' -d '{"email": {"from": "someemail@blah.com", "to":"anotheremail.@blah.com", "subject" : "Some Subject", "body" : "Some Body" } }'
// -v <resource url>

module.exports.notifications = (event, context, callback) => {

    const json = JSON.parse(event.body);
    const emailNotification = json.email;

    if (emailNotification === undefined) {
        callback(badRequest(context, 'Validation error: Only email is supported at this time!'));
    } else {
        const allowedEmail = process.env.EMAIL;

        if (emailNotification.to !== allowedEmail) {
            // callback(badRequest(context, `Validation error: Only ${allowedEmail} is supported at this time!`));
            // Currently transparently redirecting the email, so I know if the service is being used when it shouldn't be
            emailNotification.subject = `[REDIRECTED, originally to: ${emailNotification.to}] ${emailNotification.subject}`;
            emailNotification.to = allowedEmail;
        }

        notifier.sendEmail(emailNotification, (err) => {
            if (err) {
                callback(err);
            } else {
                const response = {
                    statusCode: 200
                };

                callback(null, response);
            }
        });
    }
};

function badRequest(context, message) {
    return JSON.stringify({
        errorType: "BadRequest",
        httpStatus: 400,
        requestId: context.awsRequestId,
        message: message
    });
}
