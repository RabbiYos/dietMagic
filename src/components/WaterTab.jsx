import React, { useState, useMemo } from 'react';
import { Calendar, Trash2, Edit2, Check, X, Droplets } from 'lucide-react';
import { getThemeColor } from '../utils/themeUtils';
import { formatDate, isToday } from '../utils/dateUtils';
import TipsWidget from './TipsWidget';

const WaterTab = ({ waterRecords, setWaterRecords }) => {
  const [newWater, setNewWater] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editWater, setEditWater] = useState('');
  const [editDate, setEditDate] = useState('');
  const theme = getThemeColor('water');

  const quickAmounts = [250, 500, 750, 1000];

 const addWater = (amount) => {
  const waterAmount = amount || parseInt(newWater);
  
  if (waterAmount && waterAmount > 0) {
    setWaterRecords(prevRecords => {
      const now = Date.now();
      const todayTimestamp = (() => {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })();
      
      const existingTodayRecord = prevRecords.find(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === todayTimestamp;
      });

      if (existingTodayRecord) {
        return prevRecords.map(record =>
          record.id === existingTodayRecord.id
            ? { ...record, amount: record.amount + waterAmount }
            : record
        );
      } else {
        const record = {
          id: now,
          amount: waterAmount,
          date: now
        };
        return [...prevRecords, record];
      }
    });
    setNewWater('');
  }
};

  const deleteRecord = (id) => {
    setWaterRecords(waterRecords.filter(record => record.id !== id));
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditWater(record.amount.toString());
    setEditDate(new Date(record.date).toISOString().split('T')[0]);
  };

  const saveEdit = (id) => {
    setWaterRecords(waterRecords.map(record =>
      record.id === id
        ? { ...record, amount: parseInt(editWater), date: new Date(editDate).getTime() }
        : record
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const todayWater = useMemo(() => {
    return waterRecords.find(record => isToday(record.date))?.amount || 0;
  }, [waterRecords]);

  const totalWater = useMemo(() => {
    return waterRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [waterRecords]);

  const averageWater = useMemo(() => {
    return waterRecords.length > 0 ? Math.round(totalWater / waterRecords.length) : 0;
  }, [waterRecords, totalWater]);

  const goalWater = 2000; // 2 liters
  const progressPercent = Math.min((todayWater / goalWater) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💧</span>
            <h2 className={`text-xl font-bold ${theme.text}`}>שתייה היום</h2>
          </div>
          <div className="text-left">
            <p className="text-4xl font-bold text-cyan-600">{todayWater.toLocaleString()}</p>
            <p className="text-sm text-gray-600">מתוך {goalWater.toLocaleString()} מ״ל</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-cyan-200 rounded-full h-4 mb-4">
          <div
            className="bg-cyan-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Visual Representation */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-12 rounded ${
                i < Math.floor((todayWater / 250))
                  ? 'bg-cyan-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {progressPercent >= 100 && (
          <div className="bg-cyan-100 border-2 border-cyan-300 rounded-lg p-3 text-center">
            <p className="text-cyan-800 font-bold">🎉 כל הכבוד! השגת את יעד השתייה להיום!</p>
          </div>
        )}
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">סה״כ שתייה</p>
          <p className="text-3xl font-bold text-cyan-600">
            {(totalWater / 1000).toFixed(1)} ליטר
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">ממוצע יומי</p>
          <p className="text-3xl font-bold text-cyan-600">
            {(averageWater / 1000).toFixed(1)} ליטר
          </p>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
        <h3 className={`font-bold ${theme.text} mb-3`}>הוספה מהירה</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 font-bold"
            >
              {amount} מ״ל
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
        <h3 className={`font-bold ${theme.text} mb-3`}>כמות מותאמת אישית</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={newWater}
            onChange={(e) => setNewWater(e.target.value)}
            placeholder="כמות במ״ל"
            className="flex-1 border-2 border-gray-300 rounded-lg p-2"
            onKeyPress={(e) => e.key === 'Enter' && addWater()}
          />
          <button
            onClick={() => addWater()}
            className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 font-bold"
          >
            הוסף
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          * הכמות תתווסף לרשומת היום
        </p>
      </div>

      <TipsWidget activeTab="water" />

      {/* Records List */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          היסטוריית שתייה
        </h3>

        {waterRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Droplets className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>אין רשומות שתייה עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...waterRecords].reverse().map((record) => {
              const isEditing = editingId === record.id;
              const cups = Math.round(record.amount / 250);

              return (
                <div key={record.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">כמות (מ״ל)</label>
                        <input
                          type="number"
                          value={editWater}
                          onChange={(e) => setEditWater(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">תאריך</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(record.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          שמור
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          ביטול
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{formatDate(record.date)}</p>
                          <p className="text-2xl font-bold text-cyan-600">
                            {record.amount.toLocaleString()} מ״ל
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(record)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-cyan-50 rounded p-2">
                        <p className="text-cyan-800">
                          {'💧'.repeat(cups)} ({cups} כוסות)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterTab;
