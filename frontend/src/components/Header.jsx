import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../utils/config";

export default function Header({ toggleProvinceList }) {
  // Split the app name for the header display
  const nameParts = APP_NAME.includes('Research') 
    ? ['BICOL RESEARCH', '& SURVEY GROUP'] 
    : [APP_NAME];

  return (
    <header className="bg-[#384653]">
      <nav className="flex container max-w-5xl items-center px-4 h-18 mx-auto">
        <Link to="/" className="font-bold flex items-center gap-3">
          <img src="/img/logo.png" alt="Logo" className="h-10" />
          <h1 className="text-xs text-white/90">
            {nameParts[0]}
            {nameParts.length > 1 && <br />}
            {nameParts.length > 1 && nameParts[1]}
          </h1>
        </Link>
        <div className="hidden flex-1 justify-center md:flex gap-12 text-sm text-white font-bold items-center">
          <Link to="/">Home</Link>
          <button 
            className="flex items-center gap-3" 
            onClick={toggleProvinceList}
            data-dropdown-toggle="provinceList"
          >
            Results Per Province
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>
          </button>
          <Link to="/vote" state={{ fromHome: true }}>Vote</Link>
        </div>
        <button aria-label="Menu" className="md:hidden ml-auto text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4"><path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"></path></svg>
        </button>
      </nav>
    </header>
  );
}
