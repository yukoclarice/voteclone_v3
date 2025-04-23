import { useState, useEffect } from "react";
import { candidateService } from "../utils/api";
import GovernorCard from "./GovernorCard";
import { PROVINCES } from "./provinceData";
import logger from "../utils/logger";

export default function GovernorList({ provinceCode = '' }) {
  const [governors, setGovernors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provinceData, setProvinceData] = useState({});

  useEffect(() => {
    const fetchGovernors = async () => {
      try {
        setLoading(true);
        logger.info(`Fetching governors data for province: ${provinceCode || 'all'}`);
        const response = await candidateService.getGovernors(provinceCode);
        
        logger.debug('Governor response:', response);
        
        if (response && response.success) {
          setGovernors(response.data);
          
          // Group candidates by province
          const provinceGroups = {};
          
          response.data.forEach(governor => {
            const provinceCode = governor.province_code;
            if (!provinceCode) {
              logger.warn('Governor missing province code:', governor);
              return; // Skip governors without province code
            }
            
            if (!provinceGroups[provinceCode]) {
              // Find province details from PROVINCES constant
              const provinceInfo = PROVINCES.find(p => p.code === provinceCode);
              
              provinceGroups[provinceCode] = {
                province: provinceInfo ? provinceInfo.name : "Unknown Province",
                provinceCode: provinceCode,
                region: "Province of",
                shareUrl: `https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor&province=${provinceCode}`,
                candidates: []
              };
            }
            
            // Add candidate to its province group
            provinceGroups[provinceCode].candidates.push({
              id: governor.id,
              name: governor.name,
              party: governor.party || '',
              votes: governor.votes,
              vote_percentage: governor.vote_percentage,
              picture: governor.picture
            });
          });
          
          setProvinceData(provinceGroups);
        } else {
          setError('Failed to fetch governor data');
        }
      } catch (err) {
        logger.error('Error fetching governors:', err);
        setError(err.message || 'Failed to fetch governor data');
      } finally {
        setLoading(false);
      }
    };

    fetchGovernors();
  }, [provinceCode]); // Re-fetch when provinceCode changes

  // Loading state
  if (loading) {
    return (
      <div>
        <h3 className="font-bold text-lg">GOVERNOR</h3>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          {/* Show 1 loading card if filtering by province, otherwise show all */}
          {[...(provinceCode ? [1] : PROVINCES)].map((_, index) => (
            <div key={index} className="flex flex-col rounded-md overflow-hidden animate-pulse">
              <div className="bg-dark-blue py-4 px-4 sm:px-8 h-16"></div>
              <div className="bg-white py-4 px-4 sm:px-8 min-h-64 flex items-center justify-center">
                <p className="text-gray-500">Loading governor data...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h3 className="font-bold text-lg">GOVERNOR</h3>
        <div className="bg-white p-4 rounded-md mt-3">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const provinceEntries = Object.values(provinceData);
  const provinceName = provinceCode ? 
    PROVINCES.find(p => p.code === provinceCode)?.name : 
    null;

  return (
    <div>
      <h3 className="font-bold text-lg">
        {provinceName ? `GOVERNOR` : 'GOVERNOR'}
      </h3>
      
      {provinceEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center">
          <p className="text-gray-600">No governor data available for the selected province.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          {provinceEntries.map((provinceItem) => (
            <GovernorCard 
              key={provinceItem.provinceCode}
              province={provinceItem.province}
              provinceCode={provinceItem.provinceCode}
              region={provinceItem.region}
              candidates={provinceItem.candidates}
              shareUrl={provinceItem.shareUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
} 