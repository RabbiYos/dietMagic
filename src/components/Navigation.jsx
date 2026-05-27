import React from 'react';
import { useTranslation } from 'react-i18next';
import { TABS } from '../constants/tabConfig';
import { getThemeColor } from '../utils/themeUtils';
import { logOut } from '../utils/authUtils';
import { LogOut } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, user }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const toggleLang = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
      
      {/* שורה עליונה — שם משתמש + כפתורים */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 truncate max-w-[160px]">
          👋 {user?.displayName || user?.email}
        </span>

        <div className="flex items-center gap-2">
          {/* כפתור שפה */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            <span>{i18n.language === 'he' ? '🇺🇸 EN' : '🇮🇱 עב'}</span>
          </button>

          {/* כפתור יציאה */}
          <button
            onClick={logOut}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isRTL ? 'יציאה' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* טאבים */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
    </div>
  );
};

export default Navigation;