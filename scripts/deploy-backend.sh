#!/bin/bash

# Create deployment package
cd server
zip -r ../backend.zip . -x "node_modules/*" ".env*"

# Upload to S3
aws s3 cp ../backend.zip s3://maddevs-backend-bucket/

# Trigger EC2 instance refresh (if using Auto Scaling)
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name maddevs-backend-asg \
  --strategy Rolling \
  --preferences '{"MinHealthyPercentage": 50}' 