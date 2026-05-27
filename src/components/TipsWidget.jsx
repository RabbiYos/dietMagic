import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { tipsData, getCategoryByTab } from '../tipsData';
import { getThemeColor } from '../utils/themeUtils';

const TipsWidget = ({ activeTab }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const theme = getThemeColor(activeTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      const relevantCategories = getCategoryByTab(activeTab);
      const filteredTips = tipsData.filter((tip) => relevantCategories.includes(tip.category));

      if (filteredTips.length > 0) {
        const randomTip = filteredTips[Math.floor(Math.random() * filteredTips.length)];
        setCurrentTip(randomTip);
      } else {
        setCurrentTip(null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [activeTab]);

  if (!currentTip) return null;

  return (
    <div className={`border-2 ${theme.border} ${theme.bg} rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-yellow-500" />
          <span className="text-xl font-extrabold text-gray-800">טיפ</span>
        </div>
      </div>

      <div className="text-xl leading-relaxed text-gray-800 text-right" dir="rtl">
        {currentTip.text?.replace(/\.$/, '')}
      </div>
    </div>
  );
};

export default TipsWidget;
