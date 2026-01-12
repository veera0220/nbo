import React from 'react';

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const UserNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    'My Account',
  ];

  return (
    <aside className="w-full md:w-64 bg-[#6f9fb7] text-white rounded-lg p-4">
      <h2 className="font-semibold mb-2 text-[16px]">My Account</h2>

      <ul className="space-y-2 pl-1">
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`cursor-pointer px-3 py-2 rounded-md text-sm
              ${
                activeTab === tab
                  ? 'bg-white text-[#004080] font-semibold'
                  : 'hover:bg-[#5c8fa9]'
              }
            `}
          >
            {tab}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserNav;
