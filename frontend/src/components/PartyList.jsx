import { useState, useEffect } from "react";
import { candidateService } from "../utils/api";

export default function PartyList() {
  const [partyLists, setPartyLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const PARTY_LIMIT = 4;

  useEffect(() => {
    const fetchPartyLists = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getPartyLists();
        
        if (response.success) {
          // Sort party lists by votes in descending order
          const sortedPartyLists = [...response.data].sort((a, b) => b.votes - a.votes);
          setPartyLists(sortedPartyLists);
        } else {
          setError('Failed to fetch party list data');
        }
      } catch (err) {
        console.error('Error fetching party lists:', err);
        setError(err.message || 'Failed to fetch party list data');
      } finally {
        setLoading(false);
      }
    };

    fetchPartyLists();
  }, []);

  // Calculate displayed party lists
  const displayedPartyLists = showAll ? partyLists : partyLists.slice(0, PARTY_LIMIT);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
          <div className="flex flex-col">
            <h1 className="font-medium text-white text-xl leading-5">PARTY-LIST</h1>
            <p className="text-white text-xs">Camarines Sur, Region V</p>
          </div>
        </div>
        <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 justify-center items-center">
          <p className="text-gray-500">Loading party list data...</p>
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
            <h1 className="font-medium text-white text-xl leading-5">PARTY-LIST</h1>
            <p className="text-white text-xs">Camarines Sur, Region V</p>
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
          <h1 className="font-medium text-white text-xl leading-5">PARTY-LIST</h1>
          <p className="text-white text-xs">Camarines Sur, Region V</p>
        </div>
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 party-list-container">
        <div className="flex-1 grid md:grid-cols-2 gap-x-14">
          {partyLists.length > 0 ? (
            displayedPartyLists.map((party) => (
              <div key={party.id} className="flex items-center gap-5 py-2 relative border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                    <img 
                      className="object-cover h-full w-full" 
                      src={`/img/${party.picture}`} 
                      alt={party.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/placeholder-user.png"; // Fallback image
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="min-h-16 flex flex-col justify-center">
                    <p className="font-semibold leading-5">{party.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-green-700 font-medium min-w-16">{party.vote_percentage}%</p>
                      <p className="text-red-600 font-medium">{party.votes} <span className="text-gray-400 text-sm">Votes</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-4 text-center text-gray-500">
              No party list data available
            </div>
          )}
        </div>
        {partyLists.length > PARTY_LIMIT && (
          <button 
            className="text-xs gap-3 text-gray-400 mt-4 self-center flex items-center cursor-pointer py-2"
            onClick={() => {
              // Add transition class to container before changing state
              const container = document.querySelector('.party-list-container');
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
    
    .party-list-container.transitioning > div > div {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}
