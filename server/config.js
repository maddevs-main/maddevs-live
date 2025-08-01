// Centralized config for all server secrets and environment variables
// Usage: import this file wherever you need config (MongoDB, mail, etc.)
// All secrets should be set in your .env file (never commit secrets)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/maddevs-og',
  },
  mail: {
    smtp: {
      host: process.env.MAIL_SMTP_HOST || 'smtpout.secureserver.net',
      port: process.env.MAIL_SMTP_PORT ? parseInt(process.env.MAIL_SMTP_PORT) : 587,
      secure: process.env.MAIL_SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_SMTP_USER || 'mail@maddevs.in',
        pass: process.env.MAIL_SMTP_PASS || 'vucti7-Kejdyr-nugxyj',
      },
    },
    from: process.env.MAIL_FROM || "maddevs <mail@maddevs.in>",
  },
  api: {
    secretKey: process.env.API_SECRET_KEY || 's0m3Sup3rS3cr3t',
  },
  // Add more secrets/config here as needed
  port: process.env.PORT || 4000,
};
