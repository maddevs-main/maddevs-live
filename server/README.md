# Backend Server for maddevs-og

## Setup

1. Install dependencies:

```
npm install express mongoose cors dotenv
```

2. Copy `.env.example` to `.env` and set your MongoDB URI:

```
MONGODB_URI=mongodb://localhost:27017/maddevs-og
PORT=4000
```

3. Start the server:

```
node index.js
```

The backend will run on `http://localhost:4000` by default.

## API

### POST /api/onboard

Save a meeting request to the database.

**Request body:**

```
{
  "name": "...",
  "email": "...",
  "organisation": "...",
  "title": "...",
  "message": "...",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "meetingId": "...",
  "meeting_link": "..." // Optional
}
```

**Response:**

- `201 Created` `{ success: true, id: ... }`
- `400 Bad Request` if missing fields
- `500 Server Error` on failure

### GET /api/onboard/all

Get all meeting requests.

**Response:**

- `200 OK` `{ meetings: [...] }`
- `500 Server Error` on failure

### PATCH /api/onboard/:id/approve

Approve or reject a meeting request.

**Request body:**

```
{
  "approved": true/false,
  "meeting_link": "..." // Optional, only used when approved is true
}
```

**Response:**

- `200 OK` `{ success: true, onboard: {...} }`
- `400 Bad Request` if approved is not boolean
- `404 Not Found` if onboard not found
- `500 Server Error` on failure

### PATCH /api/onboard/:id/done

Mark a meeting as completed.

**Request body:**

```
{
  "done": true
}
```

**Response:**

- `200 OK` `{ success: true, onboard: {...} }`
- `400 Bad Request` if done is not boolean
- `404 Not Found` if onboard not found
- `500 Server Error` on failure

# Mail Service

This backend includes a mail service for sending templated emails (e.g., onboarding confirmation).

## Configuration

Set your SMTP credentials in `server/config.js` (dummy values are provided by default):

```
module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/maddevs-og',
  },
  mail: {
    smtp: {
      host: process.env.MAIL_SMTP_HOST,
      port: process.env.MAIL_SMTP_PORT ? parseInt(process.env.MAIL_SMTP_PORT) : 465,
      secure: process.env.MAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_PASS,
      },
    },
    from: process.env.MAIL_FROM,
  },
  port: process.env.PORT || 4000,
};
```

## Usage

The mail service is used in the onboard POST endpoint to send a congratulatory email to the user after successful form submission. To use your own SMTP server, update the credentials in your `.env` file.

# Security Features

## API Key Protection

All sensitive API endpoints (POST, PUT, PATCH, DELETE) require an `x-api-key` header. The key must match the value of `API_SECRET_KEY` in your `.env` file.

**Example:**

```
POST /api/news
x-api-key: s0m3Sup3rS3cr3t
```

## CORS Restriction

Only requests from your frontend domain are allowed. Update the CORS origin in `server/index.js` as needed.

## Input Sanitization

All user-provided fields are sanitized using `sanitize-html` to prevent injection attacks.

## Seed Route Protection

Seed routes (`/api/blogs/seed`, `/api/news/seed`) are **disabled in production** (`NODE_ENV=production`).

## MongoDB Security

- Use a strong password in your MongoDB URI.
- Restrict access to the database using firewall rules or VPC.
- Never expose your database to the public internet.

## .env Example

```
MONGODB_URI=mongodb://username:strongpassword@host:port/dbname
PORT=4000
API_SECRET_KEY=s0m3Sup3rS3cr3t
```
