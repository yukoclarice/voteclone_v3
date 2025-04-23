# Frontend Deployment on Vercel

This guide provides instructions for deploying the frontend of Bicol Research Website to Vercel.

## Prerequisites

- Vercel account (can sign up with GitHub)
- GitHub repository with your project code
- Backend already deployed on EC2 (see EC2_DEPLOYMENT.md)

## Deployment Steps

### 1. Prepare Your Frontend Code

1. Make sure your frontend environment file is correctly set up:

```bash
# Update .env.production in the frontend directory
nano frontend/.env.production
```

Ensure it contains:
```
# API Configuration - will be used with the Vercel rewrites
VITE_API_URL=/api

# Application Configuration
VITE_APP_NAME=Bicol Research Survey
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
VITE_DISABLE_LOADING=false
VITE_DEBUG_API=false

# Deployment Environment
VITE_NODE_ENV=production

# Security
VITE_API_TIMEOUT=60000
```

2. Update the `vercel.json` file:

```bash
nano frontend/vercel.json
```

Replace `your-ec2-public-dns-or-ip` with your actual EC2 public DNS or IP address:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://your-ec2-public-dns-or-ip/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

3. Commit and push these changes to your GitHub repository:

```bash
git add frontend/.env.production frontend/vercel.json
git commit -m "Prepare frontend for Vercel deployment"
git push
```

### 2. Deploy to Vercel via GitHub

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Environment Variables:
   - You don't need to add any since they're in the .env.production file
6. Click "Deploy"

### 3. Deploy to Vercel via CLI (Alternative)

If you prefer using the command line:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to your frontend directory:
```bash
cd frontend
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the CLI prompts to log in and configure your project

### 4. Configure Custom Domain (Optional)

1. In your Vercel dashboard, select your project
2. Go to "Settings" > "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to set up DNS records with your domain registrar

### 5. Configure CORS in Backend

If you encounter CORS issues, update your backend CORS configuration on EC2:

1. SSH into your EC2 instance:
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-dns
```

2. Edit the server.js file:
```bash
cd bicolresearchwebsite_cursorv6/backend
nano src/server.js
```

3. Update the CORS configuration:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'https://your-custom-domain.com'],
  credentials: true
}));
```

4. Restart the backend:
```bash
pm2 restart bicol-backend
```

## Troubleshooting

### 1. API Connection Issues

If the frontend can't connect to the backend:
- Check if the EC2 instance is running
- Verify the EC2 security group allows traffic from Vercel
- Make sure the `vercel.json` rewrites are correctly configured
- Check your browser console for CORS errors

### 2. Build Errors

If you encounter build errors:
- Check the Vercel build logs
- Make sure all frontend dependencies are correctly listed
- Verify your vite.config.js is properly configured

### 3. CORS Errors

If you see CORS errors in the browser console:
- Make sure your backend CORS configuration includes your Vercel domain
- Check if you're using HTTP for backend but HTTPS for frontend (mixed content)
- Verify the Vercel rewrites are correctly forwarding API requests

## Updating the Application

To update your frontend:
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically rebuild and deploy

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel) 