import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";
import { Home, Info, UserPlus } from "lucide-react";
import UserListHeader from "./UserListHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../ui/dialog';


  const UserData = [
    {
      "fullName": "Anil Adani",
      "status": "ACTIVE",
      "companyName": "Amphenol KC",
      "address": "159 Kangdong Angol #04 8/04 KG, Plaza",
      "city": "Singapore",
      "state": "Singapore",
      "country": "Singapore"
    },
    {
      "fullName": "Dipengad Tandem",
      "status": "ACTIVE",
      "companyName": "Amphenol IDC",
      "address": "625 Old Trail Rd",
      "city": "Elkins",
      "state": "Pennsylvania",
      "country": "United States"
    },
    {
      "fullName": "Menon, Oppla",
      "status": "ACTIVE",
      "companyName": "Amphenol KC",
      "address": "XXX 20489, Tripurthwa Road, Thysadom, Wylia",
      "city": "Cochin",
      "state": "Kerala",
      "country": "India"
    },
    {
      "fullName": "Jones, John",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    },
    {
      "fullName": "Wilson, rektor",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    },
    {
      "fullName": "Usar2, User2",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    },
    {
      "fullName": "User1, User1",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    },
    {
      "fullName": "Gmail, Shakar",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    },
    {
      "fullName": "Chadakulan Shakar",
      "status": "ACTIVE",
      "companyName": "Amphenol IDC",
      "address": "625 Old Trail Rd",
      "city": "Elkins",
      "state": "Pennsylvania",
      "country": "United States"
    },
    {
      "fullName": "TV, Alina",
      "status": "ACTIVE",
      "companyName": "Amphenol IDC",
      "address": "XXX 20489, Tripurthwa Road, Thysadom, Wylia",
      "city": "Cochin",
      "state": "Kerala",
      "country": "India"
    },
    {
      "fullName": "Menon, Sarletha",
      "status": "ACTIVE",
      "companyName": "Amphenol IDC",
      "address": "XXX 20489, Tripurthwa Road, Thysadom, Wylia",
      "city": "Cochin",
      "state": "Kerala",
      "country": "India"
    },
    {
      "fullName": "Prasarthan, Sony",
      "status": "ACTIVE",
      "companyName": "Amphenol IDC",
      "address": "XXX 20489, Tripurthwa Road, Thysadom, Wylia",
      "city": "Cochin",
      "state": "Kerala",
      "country": "India"
    },
    {
      "fullName": "Tally, John",
      "status": "ACTIVE",
      "companyName": "Amphenol TCS",
      "address": "200 Innovative Way, Suite 201",
      "city": "Nashua",
      "state": "New Hampshire",
      "country": "United States"
    }
  ]
  // rendered table header
  const renderedTableHeader = (
    <UserListHeader selectedFilter={"7"}/>
  );

const UserManagementListView = () => {
  const navigate = useNavigate();
  const [showNote, setShowNote] = useState(false);

  const selectRowData = (rowData: any) => {
    return (
        <button
          type="button"
          onClick={() =>
            navigate("/user-form", { state: rowData })
          }
          className="text-blue-600 hover:underline text-xs"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                          {rowData.fullName}
                </span>
              </TooltipTrigger>

                <TooltipContent>
                    Edit User
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      );
  }

  return (
    <div className="bg-white p-2 helptext-main-container">
      {/* Header Section*/}
      <div className="header-section flex items-center justify-between gap-3">
        <div className="top-left-main-container flex gap-3 items-start">
          {/* Left column */}
          <div>
            <h1 className="text-xl font-semibold mb-2">User Management </h1>
          </div>

          {/* Right column */}
          <div className="flex gap-2 items-center flex justify-center">
              <button className="px-0 py-2 text-sm font-semibold text-blue-600 bg-transparent rounded"
                  onClick={() => navigate('/user-form')}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <UserPlus className="w-4 h-4" />
                      </span>
                    </TooltipTrigger>

                      <TooltipContent>
                          Create New User
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
            <button className="px-0 py-2 text-sm font-semibold text-blue-600 bg-transparent rounded"
            onClick={() => setShowNote(prev => !prev)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info className="w-4 h-4" />
                    </span>
                  </TooltipTrigger>

                    <TooltipContent>
                        Note
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          </div>
        </div>
        <div className="top-right-main-container flex flex-col">
          {/* Right Main Container column */}
          <div>
            <h3 className="text-sm font-semibold mb-0 mt-2">Acitve Users Totals</h3>
          </div>

          {/* Right column */}
          <div className="flex items-end justify-end">
            <ul className="text-xs flex flex-col items-end gap-1 text-right mt-1">
              <li>Employees : 686</li>
              <li>All : 2665</li>
              <li>Companies : 11</li>
            </ul>   
          </div>
        </div>
      </div>
      <div className="user-table-list">
        <DataTable value={UserData} 
         header={renderedTableHeader}
         rows={10}
         paginator 
         stripedRows>
          <Column field="fullName" header="Full Name" 
          body={selectRowData}
          sortable />
          <Column field="status" header="Status" sortable />
          <Column field="companyName" header="Company Name" sortable />
          <Column field="address" header="Address" sortable />
          <Column field="city" header="City" sortable />
          <Column field="state" header="State" sortable />
          <Column field="country" header="Country" sortable />
        </DataTable>
       </div>
       {/* Note Modal */}
        {showNote &&
          <Dialog open={showNote} onOpenChange={setShowNote}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Note</DialogTitle>

                  <p className="text-sm text-gray-500 mt-4">
                    * Users from all Amphenol divisions have been included in the employee count
                    and excluded from the customer account. Additionally, customers with no
                    active registered users have been excluded from the company count.
                    Accordingly, totals here may differ from other reports.
                  </p>

              </DialogHeader>
            </DialogContent>
          </Dialog>
        }
    </div>
  );
};

export default UserManagementListView;
