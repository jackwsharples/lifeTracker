import React from 'react';
import { ViewType } from '../types';

interface NavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const tabs = [
    { id: 'classes' as ViewType, label: 'Classes' },
    { id: 'ideas' as ViewType, label: 'Ideas' },
    { id: 'workouts' as ViewType, label: 'Workouts' },
    { id: 'bike' as ViewType, label: 'Bike' },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;