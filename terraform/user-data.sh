#!/bin/bash

# Update system
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install nginx
yum install -y nginx

# Create app directory
mkdir -p /var/www/maddevs-backend
cd /var/www/maddevs-backend

# Download application from S3 (you'll need to upload it first)
aws s3 cp s3://${s3_bucket}/backend.zip .
unzip backend.zip

# Install dependencies
npm install --production

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'maddevs-backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}
EOF

# Start application with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Configure nginx
cat > /etc/nginx/conf.d/maddevs-backend.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Start nginx
systemctl start nginx
systemctl enable nginx 