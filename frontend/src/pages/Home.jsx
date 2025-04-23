import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import SenatorList from '../components/SenatorList'
import PartyList from '../components/PartyList'
import GovernorList from '../components/GovernorList'
import logger from '../utils/logger'
import { useProvince } from '../context/ProvinceContext'

function Home() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchParams] = useSearchParams();
  const { setSelectedVoteProvince } = useProvince();
  const provinceCode = searchParams.get('province') || '';
  
  useEffect(() => {
    // Update the province context with the province from URL
    setSelectedVoteProvince(provinceCode);
    
    // Simulate data loading when component mounts
    const fetchData = async () => {
      logger.info(`Home page: Fetching candidate data for province: ${provinceCode || 'all'}`);
      
      // We don't show loading on the very first component load
      // But will still fetch the data silently in the background
      
      // In a real app, we would fetch data here...
      
      // Mark initial load as complete
      setIsInitialLoad(false);
    };
    
    fetchData();
  }, [provinceCode, setSelectedVoteProvince]);
  
  return (
    <>
    <StatusBar provinceCode={provinceCode} />
    <section className="bg-custom-gray py-8 min-h-screen">
      <div className="container max-w-5xl px-4 mx-auto grid gap-12">
        <div className="grid gap-4">
          <SenatorList provinceCode={provinceCode} />
          <PartyList provinceCode={provinceCode} />
        </div>
        <GovernorList provinceCode={provinceCode} />
      </div>
    </section>
    </>
  )
}

export default Home 