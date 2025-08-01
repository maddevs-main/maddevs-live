#!/bin/bash

echo "🚀 Starting maddevs-og deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Create log directories
print_status "Creating log directories..."
mkdir -p logs
mkdir -p server/logs

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd server
npm install
cd ..

# Build frontend
print_status "Building frontend..."
npm run build

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop maddevs-backend maddevs-frontend 2>/dev/null || true
pm2 delete maddevs-backend maddevs-frontend 2>/dev/null || true

# Start backend
print_status "Starting backend with PM2..."
pm2 start ecosystem.config.js --only maddevs-backend

# Wait a moment for backend to start
sleep 3

# Start frontend
print_status "Starting frontend with PM2..."
pm2 start ecosystem.config.js --only maddevs-frontend

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Show status
print_status "Deployment completed! Current PM2 status:"
pm2 list

print_status "Backend logs:"
pm2 logs maddevs-backend --lines 5

print_status "Frontend logs:"
pm2 logs maddevs-frontend --lines 5

echo ""
print_status "✅ Deployment completed successfully!"
print_status "🌐 Frontend should be available at: http://localhost:3000"
print_status "🔧 Backend API should be available at: http://localhost:4000"
echo ""
print_status "Useful commands:"
echo "  pm2 list                    - View all processes"
echo "  pm2 logs                    - View all logs"
echo "  pm2 restart all             - Restart all processes"
echo "  pm2 monit                   - Monitor processes"
echo "  pm2 stop all                - Stop all processes" 