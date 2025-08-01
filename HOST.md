Perfect — that simplifies things further.

You do not need to install MongoDB on the EC2 instance. Instead, you’ll connect to your remotely hosted MongoDB (like MongoDB Atlas) using a connection string like:

mongodb+srv://username:password@cluster0.mongodb.net/dbname

⸻

✅ REVISED SIMPLE EC2 DEPLOYMENT GUIDE

You are hosting:
• A Next.js App Router frontend (root)
• A custom Express backend (/server)
• MongoDB is hosted elsewhere (e.g., Atlas)

⸻

📁 0. Assumed Project Structure

/your-app
/server ← Express backend
/app ← Next.js frontend (App Router)
next.config.js
package.json

⸻

🚀 STEP 1: Launch & Connect to EC2 1. Launch an EC2 Ubuntu instance:
• Ubuntu 22.04
• Open ports 22, 80, 3000, 4000
• 16GB+ storage recommended 2. Connect via SSH:

chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

⸻

⚙️ STEP 2: Install Required Software

# Update & upgrade

sudo apt update && sudo apt upgrade -y

# Install Node.js LTS (18.x)

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 to run backend/frontend

sudo npm install -g pm2

# Optional: Git (if pulling from repo)

sudo apt install git -y

⸻

📁 STEP 3: Upload or Clone Your Project

Option A: Clone from GitHub

git clone https://github.com/your-name/your-app.git
cd your-app

Option B: Upload via SCP or FileZilla

scp -i your-key.pem -r /local/path/to/your-app ubuntu@<EC2_PUBLIC_IP>:~/your-app

⸻

🛠️ STEP 4: Configure Backend (/server) 1. Go to backend folder:

cd ~/your-app/server

    2.	Add environment variables in .env (create if missing):

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=4000

    3.	Install backend dependencies:

npm install

    4.	Start backend with PM2:

pm2 start index.js --name backend

⸻

🌐 STEP 5: Configure Frontend (Next.js Root) 1. Go to project root:

cd ~/your-app

    2.	Add .env file (example):

NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api

    3.	Install frontend dependencies:

npm install

    4.	Build your app:

npm run build

    5.	Start frontend:

pm2 start "npm run start" --name frontend

⸻

🌍 STEP 6 (Optional): NGINX Reverse Proxy (port 80) 1. Install NGINX:

sudo apt install nginx -y

    2.	Edit config:

sudo nano /etc/nginx/sites-available/default

    3.	Replace contents with:

server {
listen 80;
server*name *;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_set_header Host $host;
    }

}

    4.	Restart NGINX:

sudo systemctl restart nginx

This allows you to visit just http://<EC2-IP> without a port.

⸻

🔁 STEP 7: Auto-Start on Reboot 1. Save current PM2 processes:

pm2 save

    2.	Enable PM2 startup:

pm2 startup

Run the command it outputs (e.g., sudo env PATH=... pm2 startup systemd -u ubuntu --hp /home/ubuntu)

⸻

✅ DONE

Visit your app at:

http://<EC2_PUBLIC_IP>

Backend API:

http://<EC2_PUBLIC_IP>/api/your-endpoint

⸻

❓Need Help?

Would you like:
• Example .env templates?
• SSL with HTTPS and domain setup?
• Custom PM2 config file?
• GitHub Actions to auto-deploy on push?

Let me know!
