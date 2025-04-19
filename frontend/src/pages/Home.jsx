import { useEffect } from 'react'
import StatusBar from '../components/StatusBar'
import SenatorList from '../components/SenatorList'
import PartyList from '../components/PartyList'
import GovernorCard from '../components/GovernorCard'
import { GOVERNORS } from '../components/governorData'

// Import NProgress utilities and styles
import { startProgress, doneProgress } from '../utils/nprogress'
import '../styles/nprogress-custom.css'
import 'nprogress/nprogress.css'

function Home() {
  useEffect(() => {
    // Start progress bar when component mounts (page loads)
    startProgress();
    
    // Complete the progress bar after a short delay to simulate loading
    const timer = setTimeout(() => {
      doneProgress();
    }, 500);
    
    // Add event listeners for navigation
    const handleStart = () => {
      startProgress();
    };
    
    const handleComplete = () => {
      doneProgress();
    };
    
    // For regular link navigation (non-SPA)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (target && target.href && !target.href.startsWith('#') && !e.ctrlKey && !e.metaKey) {
        startProgress();
      }
    });
    
    // Clean up
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleStart);
    };
  }, []);
  
  return (
    <>
    <StatusBar />
    <section className="bg-custom-gray py-8 min-h-screen">
      <div className="container max-w-5xl px-4 mx-auto grid gap-12">
        <div className="grid gap-4">
          <SenatorList />
          <PartyList />
        </div>
        <div>
          <h3 className="font-bold text-lg">GOVERNOR</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {GOVERNORS.map((gov) => (
              <GovernorCard 
                key={gov.provinceCode} 
                province={gov.province} 
                provinceCode={gov.provinceCode}
                region={gov.region} 
                candidates={gov.candidates} 
                shareUrl={gov.shareUrl} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Home 