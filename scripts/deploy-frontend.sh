#!/bin/bash

# Build the frontend
npm run build

# Sync to S3
aws s3 sync out/ s3://maddevs-frontend-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*" 