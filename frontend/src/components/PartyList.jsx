import React from "react";

const PARTY_LISTS = [
  {
    name: "BICOL SARO",
    percent: 32.12,
    votes: 19123,
    avatar: "/img/candidates/P_10.jpg"
  },
  {
    name: "AKO BICOL",
    percent: 29.45,
    votes: 17541,
    avatar: "/img/candidates/P_14.jpg"
  },
  {
    name: "ANGAT BUHAY",
    percent: 24.03,
    votes: 14321,
    avatar: "/img/candidates/P_2.jpg"
  },
  {
    name: "KABATAAN",
    percent: 18.67,
    votes: 11234,
    avatar: "/img/candidates/P_7.jpg"
  }
];

export default function PartyList() {
  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
        <div className="flex flex-col">
          <h1 className="font-medium text-white text-xl leading-5">PARTY-LIST</h1>
          <p className="text-white text-xs">Camarines Sur, Region V</p>
        </div>
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64">
        <div className="flex-1 grid md:grid-cols-2 gap-x-14">
          {PARTY_LISTS.map((party, idx) => (
            <div key={party.name} className="flex items-center gap-5 py-2 relative border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                  <img className="object-cover h-full w-full" src={party.avatar} alt={party.name} />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="min-h-16 flex flex-col justify-center">
                  <p className="font-semibold leading-5">{party.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-green-700 font-medium min-w-16">{party.percent}%</p>
                    <p className="text-red-600 font-medium">{party.votes} <span className="text-gray-400 text-sm">Votes</span></p>
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
