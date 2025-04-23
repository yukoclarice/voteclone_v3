import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import logger from './logger';
import { DEBUG_MODE } from './config';

// Configure NProgress
NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  template: '<div class="bar" role="bar"><div class="peg"></div></div>'
});

// Export functions to start and stop the progress bar
export const startProgress = () => {
  logger.debug('NProgress: Started');
  NProgress.start();
};

export const doneProgress = () => {
  logger.debug('NProgress: Completed');
  NProgress.done();
};

// Function to simulate loading for demo purposes
export const simulateLoading = (delay = 800) => {
  startProgress();
  logger.debug(`NProgress: Simulating loading (${delay}ms)`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      doneProgress();
      resolve();
    }, delay);
  });
};
