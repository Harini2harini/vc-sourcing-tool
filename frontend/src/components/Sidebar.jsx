// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon, ListBulletIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigation = [
    { name: 'Discover', to: '/companies', icon: MagnifyingGlassIcon },
    { name: 'My Lists', to: '/lists', icon: ListBulletIcon },
    { name: 'Saved Searches', to: '/saved', icon: BookmarkIcon },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">VC Sourcing</h1>
        <p className="text-sm text-gray-500 mt-1">Precision AI scout</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">VC</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Venture User</p>
            <p className="text-xs text-gray-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;