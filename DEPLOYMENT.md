# Bicol Research Website Deployment Guide

This guide provides instructions for deploying the Bicol Research Website to Render as a Web Service.

## Prerequisites

- A Render account
- An AWS RDS MySQL database instance
- Git repository with the application code

## Deployment Steps

### 1. Prepare Your Render Account

1. Sign up or log in to [Render](https://render.com)
2. Connect your Git repository that contains the application code
3. Configure a new Web Service

### 2. Set Up Environment Variables

Configure the following environment variables in the Render dashboard:

#### Database Connection (AWS RDS)
- `DB_HOST`: Your AWS RDS endpoint
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port (typically 3306)
- `DB_DIALECT`: mysql

#### Application Configuration
- `NODE_ENV`: production
- `PORT`: 10000 (or your preferred port)
- `LOG_LEVEL`: info
- `JWT_SECRET`: A secure random string for JWT signing (if using authentication)

### 3. Configure the Web Service

1. In your Render dashboard, select "New" > "Web Service"
2. Connect to your repository
3. Give your service a name (e.g., "bicol-research-website")
4. Set the Environment to "Node"
5. Set the Build Command to: `npm install && npm run build`
6. Set the Start Command to: `npm start`
7. Choose an appropriate instance type (at least 0.5 CPU / 512MB RAM recommended)
8. Configure environment variables as described above
9. Click "Create Web Service"

### 4. Verify Deployment

1. Once deployed, Render will provide a URL for your application
2. Visit the URL to verify that the frontend is working
3. Test API endpoints by visiting `{your-url}/api/health`

### 5. Database Connectivity

Ensure AWS RDS security group allows connections from Render's IP addresses. You may need to:

1. Log into your AWS console
2. Navigate to the RDS dashboard
3. Select your database instance
4. Modify the security group to allow inbound connections from Render's IP addresses

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify that your AWS RDS instance is publicly accessible
   - Check that security groups allow connections from Render's IP addresses
   - Confirm database credentials are correct in environment variables

2. **Application Crashes**
   - Check Render logs for error messages
   - Verify that all required environment variables are set
   - Ensure the build and start commands are correct

3. **Frontend Not Loading**
   - Check if the build process completed successfully
   - Verify that the static files are being served correctly from the backend

## Maintenance

### Updating Your Application

1. Push changes to your Git repository
2. Render will automatically detect changes and redeploy your application

### Monitoring

1. Use Render's built-in logs to monitor application performance
2. Set up external monitoring services for production applications

## Support

If you encounter issues with your deployment:

1. Check Render's documentation at [https://render.com/docs](https://render.com/docs)
2. Review the application logs in the Render dashboard
3. Contact Render support if you encounter platform-specific issues 