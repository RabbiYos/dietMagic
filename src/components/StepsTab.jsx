import React, { useState } from 'react';
import { Footprints, Calendar, Trash2, Edit2, Check, X, Target } from 'lucide-react';
import { getThemeColor } from '../utils/themeUtils';
import { formatDate, isToday } from '../utils/dateUtils';
import { calculateCaloriesBurned, calculateDistance } from '../utils/calculationUtils';
import TipsWidget from './TipsWidget';

const StepsTab = ({ stepsRecords, setStepsRecords }) => {
  const [newSteps, setNewSteps] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editSteps, setEditSteps] = useState('');
  const [editDate, setEditDate] = useState('');
  const theme = getThemeColor('steps');

  const addSteps = () => {
    if (newSteps && parseInt(newSteps) > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingTodayRecord = stepsRecords.find(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      if (existingTodayRecord) {
        setStepsRecords(stepsRecords.map(record =>
          record.id === existingTodayRecord.id
            ? { ...record, steps: record.steps + parseInt(newSteps) }
            : record
        ));
      } else {
        const record = {
          id: Date.now(),
          steps: parseInt(newSteps),
          date: Date.now()
        };
        setStepsRecords([...stepsRecords, record]);
      }
      setNewSteps('');
    }
  };

  const deleteRecord = (id) => {
    setStepsRecords(stepsRecords.filter(record => record.id !== id));
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditSteps(record.steps.toString());
    setEditDate(new Date(record.date).toISOString().split('T')[0]);
  };

  const saveEdit = (id) => {
    setStepsRecords(stepsRecords.map(record =>
      record.id === id
        ? { ...record, steps: parseInt(editSteps), date: new Date(editDate).getTime() }
        : record
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const todaySteps = stepsRecords.find(record => isToday(record.date))?.steps || 0;
  const totalSteps = stepsRecords.reduce((sum, record) => sum + record.steps, 0);
  const averageSteps = stepsRecords.length > 0 ? Math.round(totalSteps / stepsRecords.length) : 0;
  const goalSteps = 10000;
  const progressPercent = Math.min((todaySteps / goalSteps) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Footprints className={`w-6 h-6 ${theme.iconColor}`} />
            <h2 className={`text-xl font-bold ${theme.text}`}>צעדים היום</h2>
          </div>
          <div className="text-left">
            <p className="text-4xl font-bold text-green-600">{todaySteps.toLocaleString()}</p>
            <p className="text-sm text-gray-600">מתוך {goalSteps.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-green-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">קלוריות נשרפו</p>
            <p className="text-lg font-bold text-orange-600">
              {calculateCaloriesBurned(todaySteps)} cal
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">מרחק</p>
            <p className="text-lg font-bold text-blue-600">
              {calculateDistance(todaySteps)} ק״מ
            </p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">סה״כ צעדים</p>
          <p className="text-3xl font-bold text-green-600">{totalSteps.toLocaleString()}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">ממוצע יומי</p>
          <p className="text-3xl font-bold text-green-600">{averageSteps.toLocaleString()}</p>
        </div>
      </div>

      {/* Add Steps */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
        <h3 className={`font-bold ${theme.text} mb-3`}>הוסף צעדים</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={newSteps}
            onChange={(e) => setNewSteps(e.target.value)}
            placeholder="מספר צעדים"
            className="flex-1 border-2 border-gray-300 rounded-lg p-2"
            onKeyPress={(e) => e.key === 'Enter' && addSteps()}
          />
          <button
            onClick={addSteps}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-bold"
          >
            הוסף
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          * הצעדים יתווספו לרשומת היום
        </p>
      </div>
              <TipsWidget activeTab="steps" />

      {/* Records List */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          היסטוריית צעדים
        </h3>

        {stepsRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Footprints className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>אין רשומות צעדים עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...stepsRecords].reverse().map((record) => {
              const isEditing = editingId === record.id;

              return (
                <div key={record.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">צעדים</label>
                        <input
                          type="number"
                          value={editSteps}
                          onChange={(e) => setEditSteps(e.target.value)}
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
                          <p className="text-2xl font-bold text-green-600">
                            {record.steps.toLocaleString()} צעדים
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
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-orange-50 rounded p-2">
                          <p className="text-xs text-gray-600">קלוריות</p>
                          <p className="font-bold text-orange-600">
                            {calculateCaloriesBurned(record.steps)} cal
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded p-2">
                          <p className="text-xs text-gray-600">מרחק</p>
                          <p className="font-bold text-blue-600">
                            {calculateDistance(record.steps)} ק״מ
                          </p>
                        </div>
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

export default StepsTab;
