# Bicol Research Survey Frontend

Frontend application for the Bicol Research and Survey project, built with React and Vite.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Application Configuration
VITE_APP_NAME=Bicol Research Survey
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# Deployment Environment
VITE_NODE_ENV=development
```

### Variable Descriptions

- **VITE_API_URL**: Base URL for API requests
- **VITE_API_TIMEOUT**: Timeout for API requests (in milliseconds)
- **VITE_APP_NAME**: Application name displayed in the header and title
- **VITE_APP_VERSION**: Application version displayed in the footer
- **VITE_ENABLE_ANALYTICS**: Enable/disable analytics (not implemented yet)
- **VITE_ENABLE_DEBUG_MODE**: Enable/disable debug logging
- **VITE_NODE_ENV**: Environment mode ('development' or 'production')

## Configuration

The application uses a centralized configuration system through the `src/utils/config.js` file, which provides access to all environment variables throughout the application.

## Features

- View candidates for different positions
- Filter candidates by province
- Submit votes for candidates
- View voting results

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
