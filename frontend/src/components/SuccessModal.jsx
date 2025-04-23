import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  
  // Handle animation and transition
  useEffect(() => {
    // Set focus to the modal for accessibility
    document.getElementById('success-modal').focus();
  }, []);
  
  const goToHomePage = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 300);
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      id="success-modal"
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
    >
      <div 
        className={`bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center text-center transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="rounded-full bg-custom-green w-24 h-24 flex items-center justify-center mb-6">
          <svg 
            className="w-16 h-16 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path 
              className="checkmark-check" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Vote successfully submitted</h2>
        <p className="text-gray-600 mb-6">Thank you for participating in the Bicol Research Survey.</p>
        
        <button
          onClick={goToHomePage}
          className="bg-custom-green hover:bg-custom-green-darker text-white font-medium py-3 px-6 rounded-md transition-colors w-full cursor-pointer"
        >
          Go back to main page
        </button>
      </div>
    </div>
  );
};

export default SuccessModal; 