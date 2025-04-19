import React, { useState, useEffect } from "react";
import { PROVINCES } from './provinceData';
import { startProgress } from '../utils/nprogress';

export default function Header() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showProvinceList, setShowProvinceList] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  
  const toggleProvinceList = () => {
    setShowProvinceList(!showProvinceList);
  };
  
  // Function to handle province selection
  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId);
    setShowProvinceList(false);
    
    // Start the progress bar before navigation
    startProgress();
    
    // Navigate to the province results page
    // This can be replaced with a React Router navigation in the future
    window.location.href = `/?province=${provinceId}`;
    
    // For future integration with backend:
    // 1. Make API call to fetch province-specific data
    // 2. Update state with the fetched data
    // 3. Render the updated data in the UI
  };
  
  useEffect(() => {
    const targetDate = new Date("2025-05-12T08:00:00+08:00").getTime(); // Manila time
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        // Election day has arrived
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#384653]">
      <nav className="flex container max-w-5xl items-center px-4 h-18 mx-auto">
        <a href="/" className="font-bold flex items-center gap-3">
          <img src="/img/logo.png" alt="Logo" className="h-10" />
          <h1 className="text-xs text-white/90">BICOL RESEARCH <br />& SURVEY GROUP</h1>
        </a>
        <div className="hidden flex-1 justify-center md:flex gap-12 text-sm text-white font-bold items-center">
          <a href="/">Home</a>
          <button className="flex items-center gap-3" onClick={toggleProvinceList}>Results Per Province
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>
          </button>
          <a href="/vote">Vote</a>
        </div>
        <button aria-label="Menu" className="md:hidden ml-auto text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4"><path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"></path></svg>
        </button>
      </nav>
      <div className="bg-dark-blue">
        <div className="mx-auto container max-w-5xl py-4 flex flex-col md:flex-row items-center h-full gap-4 md:gap-8 px-4">
          <div className="flex-1">
            <h3 className="text-white text-lg font-bold">April 3-10 2025</h3>
            <p className="text-white/80">Survey Date</p>
          </div>
          <div className="rounded-sm border border-white/30 flex h-14">
            <div className="h-full flex items-center justify-center text-white/80 px-5 text-sm leading-4">Halalan 2025<br />Countdown</div>
            <div className="border-l border-white/30 px-5 h-full flex flex-col justify-center items-center text-center text-white/80">
              <div className="flex">
                <div className="flex flex-col items-center w-11">
                  <p className="text-[#35bce8] text-lg leading-4 font-medium">{timeLeft.days.toString().padStart(2, '0')}</p>
                  <p className="text-[0.5rem] text-white/80">DAYS</p>
                </div>
                <span className="text-[#35bce8]">:</span>
                <div className="flex flex-col items-center w-11">
                  <p className="text-[#35bce8] text-lg leading-4 font-medium">{timeLeft.hours.toString().padStart(2, '0')}</p>
                  <p className="text-[0.5rem] text-white/80">HOURS</p>
                </div>
                <span className="text-[#35bce8]">:</span>
                <div className="flex flex-col items-center w-11">
                  <p className="text-[#35bce8] text-lg leading-4 font-medium">{timeLeft.minutes.toString().padStart(2, '0')}</p>
                  <p className="text-[0.5rem] text-white/80">MINUTES</p>
                </div>
                <span className="text-[#35bce8]">:</span>
                <div className="flex flex-col items-center w-11">
                  <p className="text-[#35bce8] text-lg leading-4 font-medium">{timeLeft.seconds.toString().padStart(2, '0')}</p>
                  <p className="text-[0.5rem] text-white/80">SECONDS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="provinceList" className={`absolute top-18 left-0 right-0 bg-white z-50 ${showProvinceList ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 xl:px-0">
          {PROVINCES.map((province) => (
            <div key={province.id}>
              <button 
                className="flex items-center h-16 border-b border-gray-200 w-full text-left cursor-pointer"
                onClick={() => handleProvinceSelect(province.id)}
              >
                <h1 className="flex-1 font-bold text-lg text-custom-green">{province.name}</h1> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 rotate-270">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
