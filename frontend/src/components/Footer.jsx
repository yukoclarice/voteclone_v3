import React from "react";
import { APP_NAME, APP_VERSION } from "../utils/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white">
      <div className="container mx-auto py-4 text-center">
        <p className="text-sm text-gray-800">
          Copyright © {currentYear} Bicol Research & Survey Group
        </p>
      </div>
    </footer>
  );
}
