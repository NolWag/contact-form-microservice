"use strict";

const { tagEvent } = require("./serverless_sdk");

const AWS = require('aws-sdk');
const SES = new AWS.SES();


function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'NolanDubyu@gmail.com', // SES SENDING EMAIL
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ['NolanDubyu@gmail.com'], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from your_site.com',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8000',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};


// module.exports.staticSiteMailer = async event => {

//   tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });

//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//       "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
//     },
//     body: JSON.stringify(
//       {
//         message: "Go Serverless v1.0! Your function executed successfully!",
//         input: event
//       },
//       null,
//       2
//     )
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
