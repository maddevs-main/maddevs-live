# EC2 Deployment Guide - maddevs-og

Complete step-by-step guide to deploy the full-stack application on AWS EC2 with PM2.

## Prerequisites

- AWS EC2 instance (Ubuntu 20.04+ recommended)
- Domain name (optional but recommended)
- SSH access to EC2 instance
- Git repository access
- **Pre-hosted MongoDB URI** (MongoDB Atlas, MongoDB Cloud, or any hosted MongoDB service)

## 1. EC2 Instance Setup

### Launch EC2 Instance
```bash
# Instance Type: t2.micro (free tier) or t2.small for production
# OS: Ubuntu 20.04 LTS
# Storage: 20GB minimum
# Security Groups: 
#   - SSH (22)
#   - HTTP (80)
#   - HTTPS (443)
#   - Custom TCP (3000) - Frontend
#   - Custom TCP (4000) - Backend
```

### Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## 2. Server Environment Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### Install PM2
```bash
sudo npm install -g pm2
```

### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install Git
```bash
sudo apt install git -y
```

## 3. Project Deployment

### Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/your-username/maddevs-og.git
cd maddevs-og
```

### Setup Environment Variables
```bash
# Create .env file in root
nano .env
```

**Add the following content:**
```env
# MongoDB (Use your pre-hosted MongoDB URI)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maddevs-og?retryWrites=true&w=majority

# Server
PORT=4000

# Mail (SMTP) - Update with your actual credentials
MAIL_SMTP_HOST=smtpout.secureserver.net
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_SMTP_USER=mail@maddevs.in
MAIL_SMTP_PASS=vucti7-Kejdyr-nugxyj
MAIL_FROM=mail@maddevs.in

# API
API_SECRET_KEY=your-super-secret-api-key-here

# JWT
JWT_SECRET=your-jwt-secret-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://your-domain.com
```

**Important:** Replace the `MONGODB_URI` with your actual pre-hosted MongoDB connection string.

## 4. Backend Deployment

### Install Backend Dependencies
```bash
cd server
npm install
```

### Test Backend
```bash
npm start
# Should start on port 4000
# Test: curl http://localhost:4000/api/session/status
```

### Create PM2 Ecosystem File
```bash
# Go back to project root
cd ..

# Create ecosystem.config.js
nano ecosystem.config.js
```

**Add the following content:**
```javascript
module.exports = {
  apps: [
    {
      name: 'maddevs-backend',
      cwd: './server',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    },
    {
      name: 'maddevs-frontend',
      cwd: './',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-err.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    }
  ]
};
```

### Create Log Directories
```bash
mkdir -p logs
mkdir -p server/logs
```

### Start Backend with PM2
```bash
pm2 start ecosystem.config.js --only maddevs-backend
pm2 save
pm2 startup
```

## 5. Frontend Deployment

### Install Frontend Dependencies
```bash
npm install
```

### Build Frontend
```bash
npm run build
```

### Start Frontend with PM2
```bash
pm2 start ecosystem.config.js --only maddevs-frontend
pm2 save
```

## 6. Nginx Configuration

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/maddevs-og
```

**Add the following content:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/maddevs-og /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 8. Firewall Configuration

### Configure UFW
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 9. Testing Deployment

### Test Backend API
```bash
curl http://your-domain.com/api/session/status
```

### Test Frontend
```bash
curl http://your-domain.com
```

### Test Mail Service
```bash
# Create a test onboard request
curl -X POST http://your-domain.com/api/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "organisation": "Test Org",
    "title": "Test Meeting",
    "message": "Test message",
    "date": "2024-01-15",
    "time": "14:00"
  }'
```

## 10. Monitoring and Maintenance

### PM2 Commands
```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Delete all
pm2 delete all

# Monitor
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View status
sudo systemctl status nginx
```

### Database Management
```bash
# Access your pre-hosted MongoDB dashboard
# Monitor: Database performance, storage, connections
# Backup: Use your provider's backup features
# Scaling: Upgrade through your provider's dashboard
```

## 11. Backup Strategy

### Create Backup Script
```bash
nano backup.sh
```

**Add the following content:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /home/ubuntu/maddevs-og

# Note: Database backups should be handled by your MongoDB provider
# Configure automatic backups through your provider's dashboard

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
echo "Database backups are handled by your MongoDB provider"
```

### Make Script Executable
```bash
chmod +x backup.sh
```

### Add to Crontab
```bash
crontab -e
# Add this line for daily backup at 2 AM
0 2 * * * /home/ubuntu/maddevs-og/backup.sh
```

## 12. Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :3000

# Kill process if needed
sudo kill -9 <PID>
```

**2. PM2 Process Not Starting**
```bash
# Check PM2 logs
pm2 logs maddevs-backend
pm2 logs maddevs-frontend

# Restart specific process
pm2 restart maddevs-backend
pm2 restart maddevs-frontend
```

**3. Nginx Not Working**
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**4. Database Connection Issues**
```bash
# Test MongoDB connection from EC2
# Install MongoDB client for testing
sudo apt install mongodb-clients -y

# Test connection (replace with your connection string)
mongosh "your-mongodb-connection-string"

# Check network access in your MongoDB provider
# Ensure EC2 IP is whitelisted or use 0.0.0.0/0 for all IPs
```

**5. Environment Variables Not Loading**
```bash
# Check if .env file exists
ls -la .env

# Test environment variable loading
cd server
node -e "require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); console.log('MongoDB URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')"
```

## 13. Performance Optimization

### Enable PM2 Cluster Mode (Optional)
```bash
# Update ecosystem.config.js to use cluster mode
# Change instances: 1 to instances: 'max'
```

### Enable Nginx Caching
```bash
# Add to nginx configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 14. Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication only
- [ ] Regular security updates
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] MongoDB provider network access configured
- [ ] PM2 process monitoring enabled

## 15. Final Verification

### Test All Features
1. **Frontend**: Visit your domain
2. **Backend API**: Test API endpoints
3. **Database**: Verify data persistence in your MongoDB provider
4. **Email**: Test onboard form submission
5. **Admin Panel**: Test login and CRUD operations
6. **SEO**: Check meta tags and structured data

### Performance Check
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

## Quick Commands Summary

```bash
# Deploy everything
git pull
npm install
cd server && npm install && cd ..
npm run build
pm2 restart all

# View status
pm2 list
sudo systemctl status nginx

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

Your application should now be fully deployed and accessible at `http://your-domain.com` with your pre-hosted MongoDB database! 