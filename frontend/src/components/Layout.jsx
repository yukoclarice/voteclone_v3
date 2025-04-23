import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PROVINCES } from './provinceData'
import { useProvince } from '../context/ProvinceContext'
import { useLoading } from '../context/LoadingContext'
import logger from '../utils/logger'

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedVoteProvince, setSelectedVoteProvince } = useProvince();
  const { showLoading } = useLoading();
  const isHomePage = location.pathname === '/';
  const isVotePage = location.pathname === '/vote';
  const provinceListRef = useRef(null);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showProvinceList, setShowProvinceList] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  
  // Reset dropdown when route changes
  useEffect(() => {
    setSelectedVoteProvince('');
  }, [location.pathname, setSelectedVoteProvince]);
  
  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the province list dropdown
      if (
        showProvinceList && 
        provinceListRef.current && 
        !provinceListRef.current.contains(event.target) &&
        // Make sure the click isn't on the toggle button (which is handled separately)
        !event.target.closest('button[data-dropdown-toggle="provinceList"]')
      ) {
        setShowProvinceList(false);
      }
    }
    
    // Add event listener when dropdown is shown
    if (showProvinceList) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProvinceList]);
  
  const toggleProvinceList = () => {
    setShowProvinceList(!showProvinceList);
  };
  
  // Function to handle province selection
  const handleProvinceSelect = (provinceCode) => {
    setSelectedProvince(provinceCode);
    setShowProvinceList(false);
    logger.info(`Selected province: ${provinceCode} on ${location.pathname}`);
    
    // Always navigate to home page with the province parameter
    navigate(`/?province=${provinceCode}`);
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
    <>
      <Header toggleProvinceList={toggleProvinceList} />

      {/* ProvinceList dropdown - show on both home and vote pages */}
      {(isHomePage || isVotePage) && (
        <div 
          id="provinceList" 
          className={`absolute top-18 left-0 right-0 bg-white z-50 ${showProvinceList ? 'block' : 'hidden'}`}
          ref={provinceListRef}
        >
          <div className="container mx-auto px-4 xl:px-0">
            {PROVINCES.map((province) => (
              <div key={province.code}>
                <button 
                  className="flex items-center h-16 border-b border-gray-200 w-full text-left cursor-pointer"
                  onClick={() => handleProvinceSelect(province.code)}
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
      )}
      
      {/* Blue top bar with page-specific content */}
      <div className="bg-dark-blue">
        <div className={`${isHomePage 
          ? "mx-auto container max-w-5xl py-4 flex flex-col md:flex-row items-center h-full gap-4 md:gap-8 px-4" 
          : "container max-w-lg mx-auto py-4 px-4 flex flex-col gap-3 sm:items-center"}`}>
          {isHomePage ? (
            <>
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
            </>
          ) : isVotePage ? (
            <div className="relative flex-1">
              <label htmlFor="province" className="sr-only">Select a province</label>
              <select 
                id="province" 
                value={selectedVoteProvince}
                onChange={(e) => setSelectedVoteProvince(e.target.value)}
                className="bg-white rounded-sm h-12 px-2 appearance-none text-sm w-full mx-auto sm:w-80"
              >
                <option value="">Select the province you wish to vote</option>
                {PROVINCES.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-0 bottom-0 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4"><path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg></div>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className="text-white text-lg font-bold">Bicol Research & Survey</h3>
              <p className="text-white/80">Election data and insights</p>
            </div>
          )}
        </div>
      </div>
      
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout 