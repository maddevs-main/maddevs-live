# Quick Deployment Reference

## 🚀 One-Command Deployment

```bash
# Clone and deploy everything
git clone https://github.com/your-username/maddevs-og.git
cd maddevs-og
./deploy.sh
```

## 📋 Pre-Deployment Checklist

- [ ] EC2 instance running (Ubuntu 20.04+)
- [ ] Security groups configured (22, 80, 443, 3000, 4000)
- [ ] Domain name pointed to EC2 IP
- [ ] SSH access working
- [ ] **Pre-hosted MongoDB URI ready**
- [ ] `.env` file configured with MongoDB URI

## 🔧 Essential Commands

### PM2 Management
```bash
pm2 list                    # View all processes
pm2 logs                    # View all logs
pm2 restart all             # Restart everything
pm2 stop all                # Stop everything
pm2 delete all              # Remove all processes
pm2 monit                   # Monitor processes
```

### Nginx Management
```bash
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload configuration
sudo systemctl restart nginx # Restart nginx
sudo systemctl status nginx # Check status
```

### Database Management
```bash
# Access your pre-hosted MongoDB dashboard
# Monitor: Database performance, storage, connections
# Backup: Use your provider's backup features
# Scaling: Upgrade through your provider's dashboard

# Test connection from EC2
mongosh "your-mongodb-connection-string"
```

### Application Management
```bash
# Update and redeploy
git pull
./deploy.sh

# View logs
pm2 logs maddevs-backend
pm2 logs maddevs-frontend

# Check ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :4000
```

## 🌐 Access Points

- **Frontend**: `http://your-domain.com`
- **Backend API**: `http://your-domain.com/api/`
- **Admin Panel**: `http://your-domain.com/alternatepamchange09`
- **Admin Login**: `christiangrey` / `weACEinhouse@09`

## 📧 Mail Configuration

Mail settings are in `.env` file:
```env
MAIL_SMTP_HOST=smtpout.secureserver.net
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_SMTP_USER=mail@maddevs.in
MAIL_SMTP_PASS=vucti7-Kejdyr-nugxyj
MAIL_FROM=mail@maddevs.in
```

## 🗄️ MongoDB Configuration

MongoDB connection string in `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maddevs-og?retryWrites=true&w=majority
```

**Supported MongoDB Providers:**
- MongoDB Atlas
- MongoDB Cloud
- Any hosted MongoDB service
- Self-hosted MongoDB (if accessible from EC2)

**Requirements:**
- Connection string with username/password
- Network access from EC2 IP
- Database name: `maddevs-og` (will be auto-created)

## 🔍 Troubleshooting

### Port Issues
```bash
# Kill process using port
sudo kill -9 $(sudo lsof -t -i:4000)
sudo kill -9 $(sudo lsof -t -i:3000)
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/maddevs-og
chmod +x deploy.sh
```

### Database Issues
```bash
# Check MongoDB connection
mongosh "your-mongodb-connection-string"

# Check network access in your MongoDB provider
# Ensure EC2 IP is whitelisted or use 0.0.0.0/0 for all IPs
```

### Environment Variables
```bash
# Test environment variable loading
cd server
node -e "require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); console.log('MongoDB URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')"
```

## 📊 Monitoring

### System Resources
```bash
htop                        # CPU/Memory usage
df -h                       # Disk usage
free -h                     # Memory usage
```

### Application Health
```bash
# Test API endpoints
curl http://your-domain.com/api/session/status
curl http://your-domain.com/api/blogs
curl http://your-domain.com/api/news
```

### Database Monitoring
```bash
# Access your MongoDB provider dashboard
# Monitor: Performance, storage, connections
# Check: Database operations, slow queries
# Review: Backup status, security alerts
```

## 🔄 Update Process

1. **Pull latest code**: `git pull`
2. **Run deployment**: `./deploy.sh`
3. **Verify services**: `pm2 list`
4. **Check logs**: `pm2 logs`
5. **Test endpoints**: Visit your domain
6. **Check database**: Verify data in your MongoDB provider

## 🆘 Emergency Commands

```bash
# Complete restart
pm2 delete all
./deploy.sh

# Reset everything
sudo systemctl restart nginx
pm2 restart all

# View all logs
pm2 logs && sudo tail -f /var/log/nginx/error.log

# Check database
# Go to your MongoDB provider dashboard
# Check cluster status and connection issues
```

## 💡 Benefits of Pre-hosted MongoDB

- **No server management**: Fully managed cloud database
- **Automatic backups**: Built-in backup and recovery
- **Scalability**: Easy to upgrade as needed
- **Security**: Built-in security features
- **Monitoring**: Real-time performance monitoring
- **Global distribution**: Multi-region deployment options
- **Flexibility**: Choose any MongoDB provider 