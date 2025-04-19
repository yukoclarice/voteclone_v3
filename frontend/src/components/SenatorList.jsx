import React from "react";

const SENATORS = [
  {
    name: "TULFO, ERWIN",
    party: "LAKAS",
    percent: 27.33,
    votes: 18522,
    avatar: "/img/candidates/S_63. TULFO, ERWIN (LAKAS).jpg"
  },
  {
    name: "AQUINO, BAM",
    party: "KNP",
    percent: 20.36,
    votes: 13799,
    avatar: "/img/candidates/S_5. AQUINO, BAM (KNP).jpg"
  },
  {
    name: "PANGILINAN, KIKO",
    party: "LP",
    percent: 18.77,
    votes: 12721,
    avatar: "/img/candidates/S_51. PANGILINAN, KIKO (LP).jpg"
  },
  {
    name: "CAYETANO, PIA",
    party: "NP",
    percent: 18.5,
    votes: 12539,
    avatar: "/img/candidates/S_18. CAYETANO, PIA (NP).jpg"
  },
  {
    name: "LAPID, LITO",
    party: "NPC",
    percent: 17.68,
    votes: 11981,
    avatar: "/img/candidates/S_35. LAPID, LITO (NPC).jpg"
  },
  {
    name: "LACSON, PING",
    party: "IND",
    percent: 17.67,
    votes: 11977,
    avatar: "/img/candidates/S_33. LACSON, PING (IND).jpg"
  },
  {
    name: "BINAY, ABBY",
    party: "NPC",
    percent: 17.67,
    votes: 11974,
    avatar: "/img/candidates/S_9. BINAY, ABBY (NPC).jpg"
  },
  {
    name: "SOTTO, TITO",
    party: "NPC",
    percent: 17.57,
    votes: 11908,
    avatar: "/img/candidates/S_59. SOTTO, TITO (NPC).jpg"
  },
  {
    name: "TULFO, BEN BITAG",
    party: "IND",
    percent: 16.15,
    votes: 10943,
    avatar: "/img/candidates/S_62. TULFO, BEN BITAG (IND).jpg"
  },
  {
    name: "VILLAR, CAMILLE",
    party: "NP",
    percent: 15.65,
    votes: 10604,
    avatar: "/img/candidates/S_66. VILLAR, CAMILLE (NP).jpg"
  },
  {
    name: "PACQUIAO, MANNY PACMAN",
    party: "PFP",
    percent: 15.11,
    votes: 10240,
    avatar: "/img/candidates/S_50. PACQUIAO, MANNY PACMAN (PFP).jpg"
  },
  {
    name: "BONG REVILLA,RAMON, JR.",
    party: "LAKAS",
    percent: 14.69,
    votes: 9955,
    avatar: "/img/candidates/S_11. BONG REVILLA,RAMON, JR. (LAKAS).jpg"
  }
];

export default function SenatorList() {
  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
        <div className="flex flex-col">
          <h1 className="font-medium text-white text-xl leading-5">SENATOR</h1>
          <p className="text-white text-xs">Camarines Sur, Region V</p>
        </div>
        {/* Share button placeholder */}
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64">
        <div className="flex-1 grid md:grid-cols-2 gap-x-14">
          {SENATORS.map((senator, idx) => (
            <div key={senator.name} className="flex items-center gap-5 py-2 relative border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                  <img className="object-cover h-full w-full" src={senator.avatar} alt={senator.name} />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="min-h-16 flex flex-col justify-center">
                  <p className="font-semibold leading-5">{senator.name} <span className="text-gray-400 font-light">({senator.party})</span></p>
                  <div className="flex items-center gap-2">
                    <p className="text-green-700 font-medium min-w-16">{senator.percent}%</p>
                    <p className="text-red-600 font-medium">{senator.votes} <span className="text-gray-400 text-sm">Votes</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="text-xs gap-3 text-gray-400 mt-4 self-center flex items-center cursor-pointer py-2">View all</button>
      </div>
    </div>
  );
}
