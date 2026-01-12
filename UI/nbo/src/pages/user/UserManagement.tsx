import React, { useState } from "react";
import InputField from "../../components/form/InputField";
import SelectField from "../../components/form/SelectField";
import CheckboxField from "../../components/form/CheckboxField";
import { Link } from "react-router-dom";


interface UserFormData {
  userName?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  resetPassword: boolean;
  newPassword: string;
  confirmPassword: string;
  status:string;
  title: string;
  phone: string;
  region: string;

}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    resetPassword: false,
    newPassword: "",
    confirmPassword: "",
    status:"active",
    title: "Mr.",
    phone: "",
    region: "",

  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, type } = e.target;

  if (type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).checked,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  }
};


  return (
    <div className="usermanage-form-container">
      {/* Header Section*/}
      <div className="header-section flex items-start justify-between">
        {/* Left column */}
        <div>
          <h1 className="text-xl font-semibold mb-2">User Management</h1>

          <div className="flex flex-col items-start space-y-1">
            <Link
              to="/user-list"
              className="text-sm font-semibold hover:underline hover:text-[#004080] transition"
            >
              Back to User Search
            </Link>

            <Link
              to="/login-as-user"
              className="text-sm font-semibold hover:underline hover:text-[#004080] transition"
            >
              Login as User
            </Link>
          </div>

          <p className="text-gray-600 mt-2">
            Modify an existing user below.
          </p>
        </div>

        {/* Right column */}
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600">
            Cancel
          </button>

          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
      {/* User Form Start */}
      <form className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <SelectField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              options={[
                { value: "Mr.", label: "Mr." },
                { value: "Ms.", label: "Ms." },
                { value: "Mrs.", label: "Mrs." },
              ]}
              required
            />

            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <InputField
              label="Last Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Right Column */}
          <div>
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              required
            />
            <SelectField
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              options={[
                { value: "ap_ems", label: "AP EMS" },
                { value: "ap_ems1", label: "AP EMS1" },
              ]}
            />
            <SelectField
              label="Origin"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "manager", label: "Manager" },
                { value: "user", label: "User" },
              ]}
            />
            <SelectField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "manager", label: "Manager" },
                { value: "user", label: "User" },
              ]}
              required
            />        
          </div>
        </div>
      </form>
      {/* Form end */}
    </div>
  );
};

export default UserForm;
