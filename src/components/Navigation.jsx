import React from 'react';
import { TABS } from '../constants/tabConfig';
import { getThemeColor } from '../utils/themeUtils';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {TABS.map((tab) => {
        const theme = getThemeColor(tab.id);
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `${theme.bg} ${theme.text} ${theme.border} border-2`
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {Icon && <Icon className="w-5 h-5" />}
            {tab.id === 'water' && <span className="text-lg">💧</span>}
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
