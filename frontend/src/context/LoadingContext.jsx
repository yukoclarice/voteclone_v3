import { createContext, useContext, useState, useRef } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import logger from '../utils/logger';
import { DISABLE_LOADING } from '../utils/config';

// Create context
const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  // Only use loading for province changes in Vote page
  const [provinceChangeLoading, setProvinceChangeLoading] = useState(false);
  // Keep reference to the timer for cleanup
  const timerRef = useRef(null);

  // Custom function to show loading only for province changes in Vote page
  const showProvinceChangeLoading = (duration = 800) => {
    // Skip if loading is disabled
    if (DISABLE_LOADING) {
      logger.debug('Loading screens are disabled for debugging');
      return () => {}; // Return empty cleanup function
    }
    
    // Clear any existing timer to prevent issues
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setProvinceChangeLoading(true);
    logger.debug('Province change loading triggered');
    
    // Store the timer reference
    timerRef.current = setTimeout(() => {
      setProvinceChangeLoading(false);
      timerRef.current = null;
      logger.debug('Province change loading completed automatically');
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setProvinceChangeLoading(false);
      logger.debug('Province change loading completed via cleanup');
    };
  };
  
  // Direct method to hide loading screen immediately
  const hideLoading = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setProvinceChangeLoading(false);
    logger.debug('Province change loading force hidden');
  };

  return (
    <LoadingContext.Provider value={{ 
      provinceChangeLoading, 
      showProvinceChangeLoading,
      hideLoading 
    }}>
      {!DISABLE_LOADING && provinceChangeLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
} 