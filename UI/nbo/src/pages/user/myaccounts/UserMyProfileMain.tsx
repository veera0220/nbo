import { useState } from 'react';
import SideNav from './UserMyAccountNav';
import UserRequest from './UserRequest';

const EmployeeLayout = () => {
  const [activeTab, setActiveTab] = useState('My Account');

  const renderContent = () => {
    switch (activeTab) {
      case 'My Account':
        return <UserRequest />;
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
