import React, { useState } from 'react';
import { Weight, TrendingUp, Calendar, Trash2, Edit2, Check, X, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getThemeColor } from '../utils/themeUtils';
import { formatDate } from '../utils/dateUtils';
import { calculateBMI, getBMICategory, getBMIColor } from '../utils/calculationUtils';
import TipsWidget from './TipsWidget';

const WeightTab = ({ weightRecords, setWeightRecords, height, setHeight }) => {
  const [newWeight, setNewWeight] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editWeight, setEditWeight] = useState('');
  const [editDate, setEditDate] = useState('');
  const theme = getThemeColor('weight');

  const addWeight = () => {
    if (newWeight && parseFloat(newWeight) > 0) {
      const record = {
        id: Date.now(),
        weight: parseFloat(newWeight),
        date: Date.now()
      };
      setWeightRecords([...weightRecords, record]);
      setNewWeight('');
    }
  };

  const deleteRecord = (id) => {
    setWeightRecords(weightRecords.filter(record => record.id !== id));
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditWeight(record.weight.toString());
    setEditDate(new Date(record.date).toISOString().split('T')[0]);
  };

  const saveEdit = (id) => {
    setWeightRecords(weightRecords.map(record =>
      record.id === id
        ? { ...record, weight: parseFloat(editWeight), date: new Date(editDate).getTime() }
        : record
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const currentWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : null;
  const firstWeight = weightRecords.length > 0 ? weightRecords[0].weight : null;
  const weightChange = currentWeight && firstWeight ? currentWeight - firstWeight : 0;
  const bmi = calculateBMI(currentWeight, height);

  // Prepare chart data
  const chartData = [...weightRecords]
    .sort((a, b) => a.date - b.date)
    .map(record => ({
      date: new Date(record.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' }),
      weight: record.weight
    }));

  return (
    <div className="space-y-6">
      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
          <p className={`text-sm ${theme.text} mb-1`}>משקל נוכחי</p>
          <p className={`text-3xl font-bold ${theme.text}`}>
            {currentWeight ? `${currentWeight} ק״ג` : '--'}
          </p>
        </div>
        <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
          <p className={`text-sm ${theme.text} mb-1`}>שינוי כולל</p>
          <p className={`text-3xl font-bold ${weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : theme.text}`}>
            {weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}` : '--'}
          </p>
        </div>
      </div>

      {/* BMI Section */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">BMI (מדד מסת גוף)</h3>
        <div className="mb-3">
          <label className="text-sm text-gray-600">גובה (ס״מ)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="הכנס גובה"
            className="w-full border-2 border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>
        {bmi && (
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">ה-BMI שלך</p>
            <p className={`text-3xl font-bold ${getBMIColor(bmi)}`}>{bmi}</p>
            <p className="text-sm text-gray-600 mt-1">{getBMICategory(bmi)}</p>
          </div>
        )}
      </div>

      {/* Add Weight */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
        <h3 className={`font-bold ${theme.text} mb-3`}>הוסף משקל חדש</h3>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="משקל בק״ג"
            className="flex-1 border-2 border-gray-300 rounded-lg p-2"
            onKeyPress={(e) => e.key === 'Enter' && addWeight()}
          />
          <button
            onClick={addWeight}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-bold"
          >
            הוסף
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            גרף התקדמות
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#9333ea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <TipsWidget activeTab="weight" />

      {/* Records List */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          היסטוריית משקל
        </h3>

        {weightRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Weight className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>אין רשומות משקל עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...weightRecords].reverse().map((record) => {
              const isEditing = editingId === record.id;

              return (
                <div key={record.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">משקל (ק״ג)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
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
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800">{formatDate(record.date)}</p>
                          <p className="text-2xl font-bold text-purple-600">{record.weight} ק״ג</p>
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

export default WeightTab;
