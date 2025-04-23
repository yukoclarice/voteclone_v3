import { useState, useEffect } from "react";
import { candidateService } from "../utils/api";
import { PROVINCES } from "./provinceData";
import logger from "../utils/logger";

export default function SenatorList({ provinceCode = '' }) {
  const [senators, setSenators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [filteredByProvince, setFilteredByProvince] = useState(false);
  const SENATOR_LIMIT = 12;

  // Get province name for display
  const getProvinceName = (provinceCode) => {
    if (!provinceCode) return "National";
    const province = PROVINCES.find(p => p.code === provinceCode);
    return province ? province.name : "Unknown Province";
  };

  useEffect(() => {
    const fetchSenators = async () => {
      try {
        setLoading(true);
        logger.info(`Fetching senators data for province: ${provinceCode || 'all'}`);
        const response = await candidateService.getSenators(provinceCode);
        
        logger.debug('Senator response:', response);
        
        if (response && response.success) {
          // Sort senators by votes in descending order
          const sortedSenators = [...response.data].sort((a, b) => b.votes - a.votes);
          setSenators(sortedSenators);
          setFilteredByProvince(response.filtered_by_province || false);
        } else {
          setError('Failed to fetch senators data');
        }
      } catch (err) {
        logger.error('Error fetching senators:', err);
        setError(err.message || 'Failed to fetch senators data');
      } finally {
        setLoading(false);
      }
    };

    fetchSenators();
  }, [provinceCode]);

  // Calculate displayed senators
  const displayedSenators = showAll ? senators : senators.slice(0, SENATOR_LIMIT);
  const provinceName = getProvinceName(provinceCode);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
          <div className="flex flex-col">
            <h1 className="font-medium text-white text-xl leading-5">SENATOR</h1>
            <p className="text-white text-xs">{provinceName}</p>
          </div>
        </div>
        <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 justify-center items-center">
          <p className="text-gray-500">Loading senators data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
          <div className="flex flex-col">
            <h1 className="font-medium text-white text-xl leading-5">SENATOR</h1>
            <p className="text-white text-xs">{provinceName}</p>
          </div>
        </div>
        <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 justify-center items-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
        <div className="flex flex-col">
          <h1 className="font-medium text-white text-xl leading-5">SENATOR</h1>
          <p className="text-white text-xs">{provinceName}{filteredByProvince && " Voter Results"}</p>
        </div>
        {/* Share button placeholder */}
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 senator-list-container">
        <div className="flex-1 grid md:grid-cols-2 gap-x-14">
          {senators.length > 0 ? (
            displayedSenators.map((senator, index) => (
              <div 
                key={senator.id} 
                className="flex items-center gap-5 py-2 relative border-b border-gray-200"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                    <img 
                      className="object-cover h-full w-full" 
                      src={`/img/${senator.picture}`} 
                      alt={senator.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/placeholder-user.png"; // Fallback image
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="min-h-16 flex flex-col justify-center">
                    <p className="font-semibold leading-5">
                      {senator.name} 
                      {senator.party && <span className="text-gray-400 font-light"> ({senator.party})</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-green-700 font-medium min-w-16">{senator.vote_percentage}%</p>
                      <p className="text-red-600 font-medium">{senator.votes} <span className="text-gray-400 text-sm">Votes</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-4 text-center text-gray-500">
              No senators data available
            </div>
          )}
        </div>
        {senators.length > SENATOR_LIMIT && (
          <button 
            className="text-xs gap-3 text-gray-400 mt-4 self-center flex items-center cursor-pointer py-2"
            onClick={() => {
              // Add transition class to container before changing state
              const container = document.querySelector('.senator-list-container');
              if (container) {
                container.classList.add('transitioning');
                
                // Delay state change slightly to allow transition effect
                setTimeout(() => {
                  setShowAll(!showAll);
                  
                  // Remove transition class after state change completes
                  setTimeout(() => {
                    container.classList.remove('transitioning');
                  }, 300);
                }, 50);
              } else {
                // Fallback if container not found
                setShowAll(!showAll);
              }
            }}
          >
            {showAll ? "View less" : "View all"}
          </button>
        )}
      </div>
    </div>
  );
}

// Add styles if in browser environment
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .senator-list-container.transitioning > div > div {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}
