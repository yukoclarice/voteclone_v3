import { createContext, useState, useContext } from 'react';

const ProvinceContext = createContext();

export function ProvinceProvider({ children }) {
  // This holds the province code (e.g., '050500000' for Albay)
  const [selectedVoteProvince, setSelectedVoteProvince] = useState('');

  return (
    <ProvinceContext.Provider value={{ selectedVoteProvince, setSelectedVoteProvince }}>
      {children}
    </ProvinceContext.Provider>
  );
}

export function useProvince() {
  return useContext(ProvinceContext);
} 