import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "../../ui/button";

const generalData = [
  { settingsName: "Notification Email Address", settingsVal: "notiEmailAddress" },
  { settingsName: "TSY Limit (US $K)", settingsVal: "tsyLimit" },
  { settingsName: "TSY User Warning (US $K)", settingsVal: "tsyUserWarning" },
];

  // template for Notification Email Address column
  const settingsLbl = (rowData: any) => (
    <div className="truncate w-[180px]"> {rowData.settingsName} </div>
  );

const settingsTemplate = (rowData: any) => {
  if (rowData.settingsVal === "notiEmailAddress") {
    return (
      <div className="w-full flex items-center gap-2">
        <input
          className="w-56 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Enter email"
        />
      </div>
    );
  }else {
    return (  
      <div className="w-full flex items-center gap-2">
        <span className="currency-type text-sm">$</span>
        <input
          className="w-56 border border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Enter"
        />
        <span className="currency-type-text text-sm">$ 10000</span>
      </div>
    );
  }

};


  const GeneralTable = () => {
    return (
      <div className="general-table-main-container mb-4">
        <div className="header-section">
            <h4 className="text-lg font-semibold mb-2">General</h4>
        </div>
        {/* General Table */}
        <div className="general-tbl">
            <DataTable value={generalData} rows={5} stripedRows>
                <Column 
                field="settingsName" 
                header="Setting"
                body={settingsLbl}
                style={{width: "250px"}} />
                <Column 
                field="settingsVal" 
                body={settingsTemplate}
                header="Value" />
            </DataTable>

            {/* Action Buttons */}
            <div className="flex items-left justify-start gap-2 pt-4 border-t">
              <Button className="btn-sm btn-update bng-blue-600 text-white hover:bg-blue-700">
                Update
              </Button>
            </div> 
        </div>
    </div> 
    );
  };

export default GeneralTable;
