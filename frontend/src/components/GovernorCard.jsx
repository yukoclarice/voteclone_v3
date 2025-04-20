import { useState } from "react";

export default function GovernorCard({ province, provinceCode, region, candidates, shareUrl }) {
  const [showAll, setShowAll] = useState(false);
  const CANDIDATE_LIMIT = 2;

  // Calculate displayed candidates
  const displayedCandidates = showAll ? candidates : candidates.slice(0, CANDIDATE_LIMIT);

  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
        <div className="flex flex-col flex-col-reverse">
          <h1 className="font-medium text-white text-xl leading-5">{province.toUpperCase()}</h1>
          <p className="text-white text-xs">{region}</p>
        </div>
        <a aria-label="Share" target="_blank" className="hidden" href={shareUrl}>
          {/* SVG icon here if needed */}
        </a>
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64 governor-container">
        <div className="flex-1 grid md:grid-cols-1 gap-x-14">
          {candidates.length > 0 ? (
            displayedCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center gap-5 py-2 relative border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                    <img 
                      className="object-cover h-full w-full" 
                      src={`/img/${candidate.picture}`} 
                      alt={candidate.name}
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
                      {candidate.name} 
                      {candidate.party && <span className="text-gray-400 font-light"> ({candidate.party})</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-green-700 font-medium min-w-16">{candidate.vote_percentage}%</p>
                      <p className="text-red-600 font-medium">{candidate.votes} <span className="text-gray-400 text-sm">Votes</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              No candidates available for this province
            </div>
          )}
        </div>
        {candidates.length > CANDIDATE_LIMIT && (
          <button 
            className="text-xs gap-3 text-gray-400 mt-4 self-center flex items-center cursor-pointer py-2"
            onClick={() => {
              // Add transition class to container before changing state
              const container = document.querySelector('.governor-container');
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
    
    .governor-container.transitioning > div > div {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}
