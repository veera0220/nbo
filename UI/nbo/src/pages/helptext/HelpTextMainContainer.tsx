import React from "react";
import GeneralTable  from  "./GeneralTable";
import HelpTextTable  from  "./HelpTextTable";

import { 
  Settings, 
  Home,
} from 'lucide-react';

const HelpTextMainContainer = () => {
  return (
    <div className="bg-white p-2 helptext-main-container">
      {/* Header Section*/}
      <div className="header-section flex items-start ">
        {/* Left column */}
        <div>
          <h1 className="text-xl font-semibold mb-2">NBO System Administration - Settings </h1>
        </div>

        {/* Right column */}
        <div className="flex gap-3">

          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
          </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            <Home className="w-4 h-4 mr-2" />
          </button>
        </div>
      </div>
      {/* Content Section table */}
        <div className="content-section mt-2">
            <GeneralTable />
            <HelpTextTable />
        </div>
    </div>
  );
};

export default HelpTextMainContainer;
