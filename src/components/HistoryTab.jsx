import React from 'react';
import { History, Calendar, Weight, Footprints, Dumbbell, Clock } from 'lucide-react';
import { formatDate, formatTime, calculateDuration } from '../utils/dateUtils';

const HistoryTab = ({ fastingRecords, weightRecords, stepsRecords, waterRecords, exerciseRecords }) => {
  // Combine all records with type identifier
  const allRecords = [
    ...fastingRecords.map(r => ({ ...r, type: 'fasting' })),
    ...weightRecords.map(r => ({ ...r, type: 'weight' })),
    ...stepsRecords.map(r => ({ ...r, type: 'steps' })),
    ...waterRecords.map(r => ({ ...r, type: 'water' })),
    ...exerciseRecords.map(r => ({ ...r, type: 'exercise' }))
  ];

  // Sort by date (most recent first)
  const sortedRecords = allRecords.sort((a, b) => {
    const dateA = a.date || a.startTime;
    const dateB = b.date || b.startTime;
    return dateB - dateA;
  });

  const getRecordIcon = (type) => {
    switch (type) {
      case 'fasting':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'weight':
        return <Weight className="w-5 h-5 text-purple-600" />;
      case 'steps':
        return <Footprints className="w-5 h-5 text-green-600" />;
      case 'water':
        return <span className="text-xl">💧</span>;
      case 'exercise':
        return <Dumbbell className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case 'fasting':
        return 'bg-blue-50 border-blue-200';
      case 'weight':
        return 'bg-purple-50 border-purple-200';
      case 'steps':
        return 'bg-green-50 border-green-200';
      case 'water':
        return 'bg-cyan-50 border-cyan-200';
      case 'exercise':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRecordTitle = (type) => {
    switch (type) {
      case 'fasting':
        return 'צום';
      case 'weight':
        return 'משקל';
      case 'steps':
        return 'צעדים';
      case 'water':
        return 'מים';
      case 'exercise':
        return 'אימון';
      default:
        return '';
    }
  };

  const renderRecordContent = (record) => {
    switch (record.type) {
      case 'fasting': {
        const { hours, minutes } = calculateDuration(record.startTime, record.endTime);
        return (
          <div>
            <p className="text-sm text-gray-600">
              {formatTime(record.startTime)} - {formatTime(record.endTime)}
            </p>
            <p className="font-bold text-blue-600">
              משך: {hours} שעות ו-{minutes} דקות
            </p>
          </div>
        );
      }
      case 'weight':
        return (
          <p className="font-bold text-purple-600 text-xl">
            {record.weight} ק״ג
          </p>
        );
      case 'steps':
        return (
          <p className="font-bold text-green-600 text-xl">
            {record.steps.toLocaleString()} צעדים
          </p>
        );
      case 'water':
        return (
          <p className="font-bold text-cyan-600 text-xl">
            {record.amount.toLocaleString()} מ״ל
          </p>
        );
      case 'exercise':
        return (
          <div>
            <p className="font-bold text-orange-600 text-lg">{record.name}</p>
            <p className="text-sm text-gray-600">
              {record.duration} דקות • {record.calories} קלוריות
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // Group records by date
  const recordsByDate = {};
  sortedRecords.forEach(record => {
    const date = formatDate(record.date || record.startTime);
    if (!recordsByDate[date]) {
      recordsByDate[date] = [];
    }
    recordsByDate[date].push(record);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-800">היסטוריה מלאה</h2>
        </div>
        <p className="text-sm text-blue-700">
          סה״כ {sortedRecords.length} רשומות
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-600">{fastingRecords.length}</p>
          <p className="text-xs text-gray-600">צומות</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center">
          <Weight className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-600">{weightRecords.length}</p>
          <p className="text-xs text-gray-600">שקילות</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
          <Footprints className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{stepsRecords.length}</p>
          <p className="text-xs text-gray-600">ימי צעדים</p>
        </div>
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-3 text-center">
          <span className="text-2xl mx-auto mb-1">💧</span>
          <p className="text-2xl font-bold text-cyan-600">{waterRecords.length}</p>
          <p className="text-xs text-gray-600">ימי שתייה</p>
        </div>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 text-center">
          <Dumbbell className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-orange-600">{exerciseRecords.length}</p>
          <p className="text-xs text-gray-600">אימונים</p>
        </div>
      </div>

      {/* Records Timeline */}
      {sortedRecords.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <History className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="text-lg">אין רשומות עדיין</p>
          <p className="text-sm">התחל לתעד את הפעילות שלך!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(recordsByDate).map(([date, records]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-gray-800">{date}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">{records.length} רשומות</span>
              </div>
              
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`${getRecordColor(record.type)} border-2 rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getRecordIcon(record.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700 mb-1">
                          {getRecordTitle(record.type)}
                        </p>
                        {renderRecordContent(record)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
