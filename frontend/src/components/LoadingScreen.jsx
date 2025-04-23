import React from 'react';
import { APP_NAME } from '../utils/config';
import '../styles/loading.css';

const LoadingScreen = ({ isFullPage = true }) => {
  // Split the app name for the display
  const nameParts = APP_NAME.includes('Research') 
    ? ['BICOL RESEARCH', '& SURVEY GROUP'] 
    : [APP_NAME];

  return (
    <div className={isFullPage ? 'loading-overlay' : 'loading-container'}>
      <div className="loading-content">
        <img src="/img/logo.png" alt="Logo" className="loading-logo" />
        <h1 className="text-xl font-bold text-white">
          {nameParts[0]}
          {nameParts.length > 1 && <br />}
          {nameParts.length > 1 && nameParts[1]}
        </h1>
        
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
        <p className="loading-text">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 