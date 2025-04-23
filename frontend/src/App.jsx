import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Vote from './pages/Vote'
import { ProvinceProvider } from './context/ProvinceContext'
import { LoadingProvider } from './context/LoadingContext'
import { APP_NAME, APP_VERSION, IS_DEVELOPMENT } from './utils/config'
import logger from './utils/logger'
import { useEffect } from 'react'

// Import styles
import './styles/nprogress-custom.css'
import 'nprogress/nprogress.css'
import './styles/loading.css'

// Component to check if user accessed Vote page directly
const RedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is trying to access the Vote page directly
    if (location.pathname === '/vote' && !location.state?.fromHome) {
      logger.info('Direct access to Vote page detected, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  
  return children;
};

// Wrapper for the Vote page that adds state for tracking navigation source
const VoteWithRedirect = () => {
  const location = useLocation();
  
  // If the user came from a link within the app (will have state),
  // render the Vote component, otherwise render a redirect
  return location.state?.fromHome ? <Vote /> : <Navigate to="/" replace />;
};

function App() {
  // Log application startup (but don't block rendering)
  setTimeout(() => {
    logger.group('Application Startup', () => {
      logger.info(`${APP_NAME} v${APP_VERSION}`);
      logger.info(`Environment: ${IS_DEVELOPMENT ? 'Development' : 'Production'}`);
      logger.info('Application initialized');
    });
  }, 0);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ProvinceProvider>
          <LoadingProvider>
            <RedirectHandler>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="vote" element={<VoteWithRedirect />} />
                  {/* Catch all other routes and redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </RedirectHandler>
          </LoadingProvider>
        </ProvinceProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
