import React from 'react';
import TipsWidget from './TipsWidget';

const DashboardTab = ({ weeklyData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <div className="font-bold text-gray-800 mb-2">סיכום שבועי</div>

        <div className="text-sm text-gray-700 space-y-1">
          <div>
            צומות: {weeklyData.fasts.count} (ממוצע {weeklyData.fasts.avgDuration.toFixed(1)} שעות)
          </div>
          <div>
            צעדים: {weeklyData.steps.total.toLocaleString()} (ממוצע {Math.round(weeklyData.steps.avg).toLocaleString()})
          </div>
          <div>
            מים: {weeklyData.water.total.toLocaleString()} מ״ל (ממוצע {Math.round(weeklyData.water.avg).toLocaleString()} מ״ל)
          </div>
          <div>
            אימונים: {weeklyData.exercises.count} (דקות {weeklyData.exercises.totalTime})
          </div>
        </div>
      </div>

      <TipsWidget activeTab="dashboard" />
    </div>
  );
};

export default DashboardTab;
