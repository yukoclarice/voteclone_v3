import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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
export const startProgress = () => NProgress.start();
export const doneProgress = () => NProgress.done();

// Function to simulate loading for demo purposes
export const simulateLoading = (delay = 800) => {
  startProgress();
  return new Promise(resolve => {
    setTimeout(() => {
      doneProgress();
      resolve();
    }, delay);
  });
};
