import { PROVINCES } from './provinceData';

// Helper function to get province code by name
const getProvinceCodeByName = (name) => {
  const province = PROVINCES.find(p => p.name === name);
  return province ? province.code : '';
};

export const GOVERNORS = [
  {
    province: "Albay",
    provinceCode: "050500000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "ROSAL, NOEL",
        party: "PDPLBN",
        percent: 60.55,
        votes: 3983,
        avatar: "/img/candidates/1. ROSAL, NOEL (PDPLBN).jpg"
      },
      {
        name: "SALCEDA, JOEY",
        party: "LAKAS",
        percent: 38.93,
        votes: 2561,
        avatar: "/img/candidates/2. SALCEDA, JOEY (LAKAS).jpg"
      }
    ]
  },
  {
    province: "Camarines Norte",
    provinceCode: "051600000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "PADILLA, DONG",
        party: "PFP",
        percent: 74.78,
        votes: 2793,
        avatar: "/img/candidates/2. PADILLA, DONG (PFP).jpg"
      },
      {
        name: "TALLADO, EGAY",
        party: "NPC",
        percent: 15.53,
        votes: 580,
        avatar: "/img/candidates/3. TALLADO, EGAY (NPC).jpg"
      }
    ]
  },
  {
    province: "Camarines Sur",
    provinceCode: "051700000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "VILLAFUERTE, LRAY",
        party: "NUP",
        percent: 85.56,
        votes: 7030,
        avatar: "/img/candidates/LRAY_VILLAFUERTE.jpg"
      },
      {
        name: "RODRIGUEZ, BONG",
        party: "NPC",
        percent: 7.31,
        votes: 601,
        avatar: "/img/candidates/RODRIGUEZ BONG.jpg"
      }
    ]
  },
  {
    province: "Catanduanes",
    provinceCode: "052000000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "AZANZA, PATRICK ALAIN",
        party: "IND",
        percent: 55.85,
        votes: 19293,
        avatar: "/img/candidates/2. AZANZA, PATRICK ALAIN (IND).jpg"
      },
      {
        name: "CUA, BOSSTE",
        party: "LAKAS",
        percent: 40.85,
        votes: 14111,
        avatar: "/img/candidates/3. CUA, BOSSTE (LAKAS).jpg"
      }
    ]
  },
  {
    province: "Masbate",
    provinceCode: "054100000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "KHO, RICHARD",
        party: "LAKAS",
        percent: 51.00,
        votes: 1576,
        avatar: "/img/candidates/1. KHO, RICHARD (LAKAS).jpg"
      },
      {
        name: "TUASON, SOCRATES",
        party: "LP",
        percent: 49.00,
        votes: 1514,
        avatar: "/img/candidates/2. TUASON, SOCRATES (LP).jpg"
      }
    ]
  },
  {
    province: "Sorsogon",
    provinceCode: "056200000",
    region: "Province of",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bicolresearchandsurvey.com?position=governor",
    candidates: [
      {
        name: "HAMOR, BOBOY",
        party: "NPC",
        percent: 70.76,
        votes: 1735,
        avatar: "/img/candidates/1. HAMOR, BOBOY (NPC).jpg"
      },
      {
        name: "SO, CATTLEYA",
        party: "PFP",
        percent: 25.98,
        votes: 637,
        avatar: "/img/candidates/2. SO, CATTLEYA (PFP).jpg"
      }
    ]
  }
];
