import { useEffect } from 'react'
import { startProgress, doneProgress } from '../utils/nprogress'
import { useProvince } from '../context/ProvinceContext'

function Vote() {
  useEffect(() => {
    // Save the original document title
    const originalTitle = document.title;
    
    // Change the document title when component mounts
    document.title = "Vote Now";
    
    // Start progress bar when component mounts
    startProgress();
    
    // Complete the progress bar after a short delay
    const timer = setTimeout(() => {
      doneProgress();
    }, 500);
    
    // Restore the original title when component unmounts
    return () => {
      document.title = originalTitle;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-custom-gray min-h-screen">
      <div class="container max-w-5xl px-4 py-8 mx-auto"><div class="bg-white p-6 rounded-md"><h1 class="font-extrabold text-lg">Online Voting Rules</h1> <h3 class="mt-4">1. Voters must be 18+ and registered in the Bicol Region.</h3>  <h3 class="mt-4">2. All submitted information must be truthful.</h3> <h3 class="mt-4">3. A maximum of 3 votes per day per public IP address.</h3> <h3 class="mt-4">4. Votes cannot be changed or revoked once submitted.</h3>   <p class="italic mt-6">By voting, you agree to follow these rules and maintain fairness in
      the process.</p></div></div>
    </div>
  );
}

export default Vote 