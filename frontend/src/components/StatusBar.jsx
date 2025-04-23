import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logger from "../utils/logger";
import { statusService } from "../utils/api";
import { PROVINCES } from "./provinceData";

export default function StatusBar({ provinceCode }) {
  const navigate = useNavigate();
  const [votingOpen, setVotingOpen] = useState(true); // Default to open until API response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Find province name based on code
  const provinceName = provinceCode 
    ? PROVINCES.find(p => p.code === provinceCode)?.name || 'Unknown Province' 
    : null;

  // Fetch voting status when component mounts
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        setLoading(true);
        const response = await statusService.getVotingStatus();
        setVotingOpen(response.data.isVotingOpen);
        logger.info(`Voting status loaded: ${response.data.isVotingOpen ? 'open' : 'closed'}`);
      } catch (err) {
        logger.error('Error fetching voting status:', err);
        setError('Unable to check if voting is open');
        // Default to closed if there's an error
        setVotingOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVotingStatus();
  }, []);

  const handleVoteNow = () => {
    logger.info('Navigating to vote page from status bar');
    navigate('/vote', { state: { fromHome: true } });
  };

  // If still loading, show a minimal version
  if (loading) {
    return (
      <div className="bg-custom-green">
        <div className="py-4 md:py-4 container max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
          <h1 className="text-white font-bold text-xl flex-1">Loading voting status...</h1>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="bg-yellow-600">
        <div className="py-4 md:py-4 container max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
          <h1 className="text-white font-bold text-xl flex-1">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-custom-green">
      <div className="py-4 md:py-4 container max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
        <h1 className="text-white font-bold text-xl flex-1">
          {provinceName ? (
            <div className="flex-1">
              <p className="text-sm font-normal text-white">Province of</p>
              <h1 className="text-white font-bold text-xl flex-1 leading-5">{provinceName.toUpperCase()}</h1>
              <p className="text-sm font-normal text-white">Region V</p>
            </div>
          ) : (
            votingOpen 
              ? "Voting is now open. Cast your vote for the 2025 Elections." 
              : "Voting is now officially closed. Thank you for your cooperation."
          )}
        </h1>
        
        {votingOpen && (
          <button 
            onClick={handleVoteNow}
            className="bg-custom-red hover:bg-custom-red/90 text-white font-semibold px-6 py-2 rounded-md transition-colors cursor-pointer"
            title="Go to voting page"
          >
            Vote Now
          </button>
        )}
      </div>
    </div>
  );
}


