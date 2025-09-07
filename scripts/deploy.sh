#!/bin/bash

# Campus Navigation Backend Deployment Script

set -e

echo "🚀 Starting Campus Navigation Backend Deployment..."

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p uploads/images uploads/audio uploads/360views
mkdir -p logs

# Set proper permissions
print_status "Setting proper permissions..."
chmod 755 uploads
chmod 755 uploads/images uploads/audio uploads/360views

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env .env.production
    print_warning "Please update .env.production with your production values!"
fi

# Build and start services
print_status "Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if backend is running
print_status "Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_status "Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start properly"
        docker-compose logs backend
        exit 1
    fi
    sleep 2
done

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "MongoDB is running!"
else
    print_warning "MongoDB connection check failed, but continuing..."
fi

# Display service status
print_status "Service Status:"
docker-compose ps

# Display useful information
echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
echo "📋 Service Information:"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo "   MongoDB: localhost:27017"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Email: superadmin@sau.edu.pk"
echo "   Password: password123"
echo "   ⚠️  Please change the password after first login!"
echo ""
echo "📁 Upload Directory: ./uploads"
echo "📊 Logs: docker-compose logs [service-name]"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "🔄 To restart services: docker-compose restart"
echo "📜 To view logs: docker-compose logs -f"

# Optional: Run basic API tests
read -p "Do you want to run basic API tests? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Running basic API tests..."
    
    # Test health endpoint
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_status "✅ Health check passed"
    else
        print_error "❌ Health check failed"
    fi
    
    # Test API endpoints
    if curl -f http://localhost:5000/api/locations > /dev/null 2>&1; then
        print_status "✅ Locations API accessible"
    else
        print_error "❌ Locations API failed"
    fi
    
    if curl -f http://localhost:5000/api/departments > /dev/null 2>&1; then
        print_status "✅ Departments API accessible"
    else
        print_error "❌ Departments API failed"
    fi
fi

print_status "Deployment script completed!"

