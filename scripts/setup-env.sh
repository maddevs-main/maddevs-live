#!/bin/bash

# Set environment variables in AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/maddevs/production/MONGODB_URI" \
  --value "mongodb://username:password@host:port/dbname" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/maddevs/production/API_SECRET_KEY" \
  --value "your-secret-key" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/maddevs/production/MAIL_SMTP_PASS" \
  --value "your-email-password" \
  --type "SecureString" 