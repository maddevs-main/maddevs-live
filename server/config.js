// Centralized config for all server secrets and environment variables
// Usage: import this file wherever you need config (MongoDB, mail, etc.)
// All secrets should be set in your .env file (never commit secrets)

require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/maddevs-og',
  },
  mail: {
    smtp: {
      host: 'smtpout.secureserver.net', // e.g. smtp.gmail.com
      port: process.env.MAIL_SMTP_PORT ? parseInt(process.env.MAIL_SMTP_PORT) : 587,
      secure: process.env.MAIL_SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: 'mail@maddevs.in',
        pass: 'vucti7-Kejdyr-nugxyj',
      },
    },
    from: 'mail@maddevs.in', // e.g. noreply@example.com
  },
  api: {
    secretKey: process.env.API_SECRET_KEY || 's0m3Sup3rS3cr3t',
  },
  // Add more secrets/config here as needed
  port: process.env.PORT || 4000,
}; 