import React from "react";

export default function StatusBar() {
  return (
    <div className="bg-custom-green">
      <div className="py-4 md:py-4 container max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
        <h1 className="text-white font-bold text-xl flex-1">Voting is now officially closed. Thank you for your cooperation.</h1>
      </div>
    </div>
  );
}


