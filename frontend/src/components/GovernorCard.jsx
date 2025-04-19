import React from "react";

export default function GovernorCard({ province, region, candidates, shareUrl }) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-dark-blue py-4 px-4 sm:px-8">
        <div className="flex flex-col flex-col-reverse">
          <h1 className="font-medium text-white text-xl leading-5">{province.toUpperCase()}</h1>
          <p className="text-white text-xs">Province of</p>
        </div>
        <a aria-label="Share" target="_blank" className="hidden" href={shareUrl}>
          {/* SVG icon here if needed */}
        </a>
      </div>
      <div className="flex flex-col py-4 bg-white px-4 sm:px-8 min-h-64">
        <div className="flex-1 grid md:grid-cols-1 gap-x-14">
          {candidates.map((candidate) => (
            <div key={candidate.name} className="flex items-center gap-5 py-2 relative border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="bg-gray-1000 rounded-full w-14 aspect-square overflow-hidden flex justify-center items-center">
                  <img className="object-cover h-full w-full" src={candidate.avatar} alt={candidate.name} />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="min-h-16 flex flex-col justify-center">
                  <p className="font-semibold leading-5">{candidate.name} <span className="text-gray-400 font-light">({candidate.party})</span></p>
                  <div className="flex items-center gap-2">
                    <p className="text-green-700 font-medium min-w-16">{candidate.percent}%</p>
                    <p className="text-red-600 font-medium">{candidate.votes} <span className="text-gray-400 text-sm">Votes</span></p>
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
