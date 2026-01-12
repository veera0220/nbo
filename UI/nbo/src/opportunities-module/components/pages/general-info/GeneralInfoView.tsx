
import { Home, Settings } from "lucide-react";
import GeneralTable  from  "./GeneralTable";
import HelpTextTable  from  "./HelpTextTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';

const GeneralInfoMain = () => {
  return (
    <div className="bg-white p-2 helptext-main-container">
      {/* Header Section*/}
      <div className="header-section flex items-start gap-3">
        {/* Left column */}
        <div>
          <h1 className="text-xl font-semibold mb-2">NBO System Administration - Settings </h1>
        </div>

        {/* Right column */}
        <div className="flex gap-2 items-center flex justify-center">
          <button className="px-0 py-2 text-sm font-semibold text-blue-600 bg-transparent rounded">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Settings className="w-4 h-4" />
                    </span>
                  </TooltipTrigger>

                    <TooltipContent>
                        Settings
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </button>
            <button className="px-0 py-2 text-sm font-semibold text-blue-600 bg-transparent rounded">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Home className="w-4 h-4" />
                    </span>
                  </TooltipTrigger>

                    <TooltipContent>
                        Home
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

export default GeneralInfoMain;
