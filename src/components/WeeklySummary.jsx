import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useWeeklyData } from '../hooks/useWeeklyData';

const WeeklySummary = ({ fastingRecords, weightRecords, stepsRecords, waterRecords, exerciseRecords }) => {
  const weeklyData = useWeeklyData(fastingRecords, weightRecords, stepsRecords, waterRecords, exerciseRecords);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="font-bold text-green-800">סיכום שבועי</h3>
      </div>
      
      <div className="space-y-2 text-sm text-green-700">
        {weeklyData.fasts.count > 0 && (
          <p>✅ ביצעת {weeklyData.fasts.count} צומות השבוע</p>
        )}
        {weeklyData.steps.total > 0 && (
          <p>✅ צעדת {weeklyData.steps.total.toLocaleString()} צעדים</p>
        )}
        {weeklyData.water.total > 0 && (
          <p>✅ שתית {weeklyData.water.total.toLocaleString()} מ״ל מים</p>
        )}
        {weeklyData.exercises.count > 0 && (
          <p>✅ השלמת {weeklyData.exercises.count} אימונים</p>
        )}
        {weeklyData.weight.change < 0 && (
          <p>✅ ירדת {Math.abs(weeklyData.weight.change).toFixed(1)} ק״ג</p>
        )}
        
        {weeklyData.fasts.count === 0 && 
         weeklyData.steps.total === 0 && 
         weeklyData.exercises.count === 0 && 
         weeklyData.water.total === 0 && (
          <p>התחל לתעד את הפעילות שלך כדי לראות התקדמות! 💪</p>
        )}
      </div>
    </div>
  );
};

export default WeeklySummary;
