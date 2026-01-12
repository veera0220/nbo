import { useState, useEffect } from 'react';
import axios from "axios";
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Button } from '../../../ui/button';
import { Checkbox } from '../../../ui/checkbox'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';

import { 
Search,
XIcon
} from 'lucide-react';

import { useLocation, useNavigate } from "react-router-dom";

interface UserFormData {
  userName:string;
  firstName: string;
  lastName: string;
  email: string;
  companyName:string;
  role: string;
  status:string;
  region: string;
  regionLookup:string;
  regionSelected:string[];
}

const CreateNewUser = () => {

  const { state } = useLocation(); // getData
  const [showEmployees, setShowEmployees] = useState<boolean>(true);
  const [showCompanyName, setShowCompanyName] = useState<boolean>(true);

const options = [
  "Company name 7",
  "Company name 6",
  "Company name 5",
  "Company name 4",
  "Company name 3",
];


  console.log("Edit User", state)
  const navigate = useNavigate();
  const employeeList = [
    "ATCS Employee Only",
    "ACP Employee Only",
    "AMTA Employee Only",
    "ASCA Employee Only",
    "InterCon Systems Employee Only",
    "Shouh Min Employee Only",
    "Spectra-Strip Employee Only",
    "ATCS Assigned Sales",
    "ATCS Assigned Rep",
    "ATCS FAE",
    "ATCS NBO System Admin",
  ];

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    userName:"",
    firstName: "",
    lastName: "",
    email: "",
    companyName:"",
    status: "",
    region: "",
    role: "",
    regionLookup:"",
    regionSelected:[],
  });

  // Prefill data when editing
  useEffect(() => {
    if (state) {
      setFormData({
        userName:state?.username || "",
        firstName: state.firstName || "",
        lastName: state.lastName || "",
        email: state.email || "",
        companyName: state.companyName || "",
        status: state.status || "",
        region: state.region || "",
        role: state.role || "",
        regionLookup: "",
        regionSelected: [],
      });
    }
  }, [state]);

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev:any) => ({
      ...prev,
      [name]: value,
    }));
  };

//   const handleSave = (e: React.FormEvent) => {
//   e.preventDefault();

//   // You can call API here
//   console.log("Form Data:", formData);

//   // After success redirect
//   navigate("/user-management");
// };






// const handleSave = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     await axios({
//       method: state ? "put" : "post",
//       url: "https://0dd70a6ce400.ngrok-free.app/api/site",
//       data: formData,
//     });

//     navigate("/user-management");
//   } catch (error) {
//     console.error(error);
//     alert("Save failed");
//   }
// };

const handleSave = async () => {
  try {
    const response = await axios.get(
      "https://0dd70a6ce400.ngrok-free.app/api/site"
    );

    console.log(response.data);
  } catch (error) {
    console.error(error);
    alert("Fetch failed");
  }
};



const handleCancel = () => {
  navigate("/user-management");
};

  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='user-management-form p-6 bg-white rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-6'>{state? "Edit User" : "Create New User" }</h2>
      <form className='space-y-4 max-w-3xl'  onSubmit={handleSave}>
        <div className='flex gap-3 justify-between'>
          <div className='left-section space-y-4 w-full mr-4'>
            <div>
              <Label htmlFor="name">User Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder="Enter user name"
                required
              />
            </div>
            <div>
              <Label htmlFor="name">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </div>
             <div>
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value:any) => handleChange("region", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap_ems">AP EMS</SelectItem>
                  <SelectItem value="ap_ems1">AP EMS1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.role === "FSE" || formData.role === "FAE") && (
              <>
                {/* Region Lookup */}
                <div>
                  <Label htmlFor="regionLookup">Region Lookup</Label>
                  <Select
                    value=""
                    onValueChange={(value: any) => {
                      if (!formData.regionSelected.includes(value)) {
                        handleChange("regionSelected", [...formData.regionSelected, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Region Lookup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test1">Test 1</SelectItem>
                      <SelectItem value="test2">Test 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region(s) Selected as Tag Buttons */}
                <div className="mt-4">
                  <Label>Region(s) Selected</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {formData.regionSelected.map((region: string) => (
                      <button
                        key={region}
                        type="button"
                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        onClick={() =>
                          handleChange(
                            "regionSelected",
                            formData.regionSelected.filter((r: string) => r !== region)
                          )
                        }
                      >
                        {region} <XIcon className="ml-2" style={{width: "15px", height: "15px"}}/>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}            
          </div>
          <div className='left-section space-y-4 w-full ml-4'>           
            <div>
              <Label htmlFor="role">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value:any) => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>   
            <div>
              <Label htmlFor="name">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </div>          
             <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value:any) => handleChange("role", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FSE">FSE</SelectItem>
                  <SelectItem value="FAE">FAE</SelectItem>
                </SelectContent>
              </Select>
            </div>                   

            <div>
              <Label htmlFor="companyname">Company Name</Label>
              <Select>
                <SelectTrigger className="relative pl-9">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <SelectValue placeholder="Search ..." />
                </SelectTrigger>

                <SelectContent>
                  {/* Search Input */}
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Type to search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-md border px-2 py-1 text-sm outline-none"
                    />
                  </div>

                  {/* Options */}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No results found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* employee */}
        <>
          <div className=''>
            <h3 className='font-semibold'>Access Group(S)</h3>
          </div>
          {/* Employee List */}
          <div className='employee-type-list'>
            <div className='title flex items-center mb-2 gap-2'>
              <h4 className='font-semibold mb-0'>Employee</h4> 
              <button className='text-blue-500 text-xs font-semibold cursor-pointer'
                type="button"
                onClick={() => setShowEmployees(prev => !prev)}
                style={{paddingTop:"7px !important"}}
              >{showEmployees ? "Hide" : "Show"}</button>
              
            </div>
             {showEmployees &&
              employeeList.map((employee, index) => {
              const isChecked = selectedCustomers.includes(employee);

              return (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <Checkbox
                    id={`customer-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked:any) => {
                      setSelectedCustomers((prev) =>
                        checked
                          ? [...prev, employee]
                          : prev.filter((c) => c !== employee)
                      );
                    }}
                  />
                  <label
                    htmlFor={`customer-${index}`}
                    className="text-sm cursor-pointer mb-0"
                  >
                    {employee}
                  </label>
                </div>
              );
            })}
          </div>  
          {/* Customer */}
          <div className='employee-type-list'>
            {/* <div className='title flex items-center mb-2 gap-2'>
              <h4 className='font-semibold mb-0'>Customer</h4> 
              <button className='text-blue-500 text-xs font-semibold cursor-pointer'
                type="button"
                onClick={() => setShowCompanyName(prev => !prev)}
                style={{paddingTop:"7px !important"}}
              >{showCompanyName ? "Hide" : "Show"}</button>
              
            </div> */}
             {/* {showCompanyName && */}
              <div className="profile-row flex items-start gap-2 mb-6">
                <span className="text-sm label w-32 text-left font-semibold text-gray-600">
                  Company Name
                </span>
                <span className="colon font-medium text-gray-600">:</span>
                <span className="value text-gray-800 leading-6">
                  Amphenol ICC
                </span>
              </div>
              {/* } */}
          
          </div>          
        </>
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button type="submit">
            Save
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>      
      </form>
    </div>
  );
}

export default CreateNewUser;

