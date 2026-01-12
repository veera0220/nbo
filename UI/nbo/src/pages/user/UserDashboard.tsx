import { useState } from 'react';
import SideNav from './UserNav';
import UserManagement from './UserManagement';
import UserRequest from './UserRequest';

const EmployeeLayout = () => {
  const [activeTab, setActiveTab] = useState('User Management');

  const renderContent = () => {
    switch (activeTab) {
      case 'User Request':
        return <UserRequest />;
      case 'User Management':
        return <UserManagement />;
      case 'Sites':
        return <h1 className="text-xl font-semibold">Sites</h1>;
      case 'Registration':
        return <h1 className="text-xl font-semibold">Registration</h1>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-gray-100 min-h-screen">
      {/* Left Nav */}
      <SideNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Right Content */}
      <main className="flex-1 bg-white rounded-lg p-6 shadow">
        {renderContent()}
      </main>
    </div>
  );
};

export default EmployeeLayout;
