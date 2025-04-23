# Backend Deployment on AWS EC2

This guide provides instructions for deploying the backend of Bicol Research Website to AWS EC2.

## Prerequisites

- AWS account with EC2 access
- SSH key pair for EC2 instance
- RDS MySQL database instance

## Deployment Steps

### 1. Launch EC2 Instance

1. Go to AWS Management Console and navigate to EC2
2. Click "Launch Instance"
3. Select Amazon Linux 2023 or Ubuntu Server 22.04
4. Choose instance type (t2.micro is eligible for free tier)
5. Configure instance:
   - Network: Default VPC
   - Subnet: Any public subnet
   - Auto-assign Public IP: Enable
6. Add storage: Default is sufficient (8 GB)
7. Configure security group:
   - SSH (TCP/22) from your IP
   - HTTP (TCP/80) from anywhere
   - HTTPS (TCP/443) from anywhere
   - Custom TCP (TCP/5000) from anywhere
8. Review and launch with your key pair

### 2. Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-dns
# or for Ubuntu
ssh -i your-key.pem ubuntu@your-ec2-public-dns
```

### 3. Set Up Environment

```bash
# Update system packages
sudo yum update -y  # Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # Ubuntu

# Install Node.js (version 18.x)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -  # Amazon Linux
sudo yum install -y nodejs
# or
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -  # Ubuntu
sudo apt install -y nodejs

# Install Git
sudo yum install git -y  # Amazon Linux
# or
sudo apt install git -y  # Ubuntu

# Install PM2 for process management
sudo npm install pm2 -g
```

### 4. Clone and Set Up Application

```bash
# Clone repository
git clone https://github.com/your-username/bicolresearchwebsite_cursorv6.git
cd bicolresearchwebsite_cursorv6/backend

# Install dependencies
npm install
```

### 5. Create Environment Configuration

Create a .env file in the backend directory:

```bash
nano .env
```

Add the following configuration:

```
NODE_ENV=production
PORT=5000
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_DIALECT=mysql
LOG_LEVEL=info
```

### 6. Start Application with PM2

```bash
# Start application
pm2 start src/server.js --name bicol-backend

# Ensure PM2 starts on system boot
pm2 startup
# Follow the command PM2 outputs

# Save PM2 process list
pm2 save
```

### 7. Set Up Nginx as Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo yum install nginx -y  # Amazon Linux
# or
sudo apt install nginx -y  # Ubuntu

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/conf.d/bicol-backend.conf  # Amazon Linux
# or
sudo nano /etc/nginx/sites-available/bicol-backend  # Ubuntu
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-ec2-public-dns-or-domain;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

For Ubuntu, create symlink and test:

```bash
sudo ln -s /etc/nginx/sites-available/bicol-backend /etc/nginx/sites-enabled/
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

### 8. Set Up SSL with Certbot (Optional but Recommended)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# or
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Certbot will modify your Nginx config and set up auto-renewal
```

## Updating the Application

To update the application when changes are made:

```bash
# Navigate to your application directory
cd ~/bicolresearchwebsite_cursorv6

# Pull latest changes
git pull

# Install any new dependencies
cd backend
npm install

# Restart the application
pm2 restart bicol-backend
```

## Monitoring

Check application status:

```bash
pm2 status
pm2 logs bicol-backend
```

## Common Issues

1. **Connection Refused**
   - Check if the app is running: `pm2 status`
   - Verify security group allows traffic on port 5000

2. **Database Connection Issues**
   - Verify RDS security group allows connections from EC2 IP
   - Check database credentials in .env file

3. **Permission Issues**
   - Use `sudo` for system operations
   - Ensure proper ownership: `chown -R ec2-user:ec2-user ~/bicolresearchwebsite_cursorv6` 