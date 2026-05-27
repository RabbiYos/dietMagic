import React, { useState } from 'react';
import { Dumbbell, Calendar, Trash2, Edit2, Check, X, Clock, Flame } from 'lucide-react';
import { getThemeColor } from '../utils/themeUtils';
import { formatDate } from '../utils/dateUtils';
import TipsWidget from './TipsWidget';
import { exercisesList } from '../data/exercisesData'; // ודא שיצרת את הקובץ הזה

const ExerciseTab = ({ exerciseRecords, setExerciseRecords }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCalories, setEditCalories] = useState('');
  const [editDate, setEditDate] = useState('');

  const theme = getThemeColor('exercise');

  const addExercise = (quick = null) => {
    const name = quick?.name || exerciseName;
    const dur = quick?.duration || parseInt(duration);
    const cal = quick?.calories || parseInt(calories);

    if (name && dur > 0) {
      setExerciseRecords(prevRecords => {
        const now = Date.now();
        const record = { 
          id: now, 
          name: name, 
          duration: dur, 
          calories: cal || 0, 
          date: now 
        };
        return [...prevRecords, record];
      });
      if (!quick) {
        setExerciseName('');
        setDuration('');
        setCalories('');
      }
    }
  };

  const deleteRecord = (id) => {
    setExerciseRecords(exerciseRecords.filter(record => record.id !== id));
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditName(record.name);
    setEditDuration(record.duration.toString());
    setEditCalories(record.calories.toString());
    setEditDate(new Date(record.date).toISOString().split('T')[0]);
  };

  const saveEdit = (id) => {
    setExerciseRecords(exerciseRecords.map(record => 
      record.id === id ? { 
        ...record, 
        name: editName, 
        duration: parseInt(editDuration), 
        calories: parseInt(editCalories), 
        date: new Date(editDate).getTime() 
      } : record
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const totalExercises = exerciseRecords.length;
  const totalDuration = exerciseRecords.reduce((sum, record) => sum + record.duration, 0);
  const totalCalories = exerciseRecords.reduce((sum, record) => sum + record.calories, 0);

  return (
    <div className="space-y-6">
      {/* סטטיסטיקה שבועית/כללית */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4 text-center`}>
          <div className="text-sm text-gray-600 mb-1">סה״כ אימונים</div>
          <div className={`text-2xl font-bold ${theme.text}`}>{totalExercises}</div>
        </div>
        <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4 text-center`}>
          <div className="text-sm text-gray-600 mb-1">דקות</div>
          <div className={`text-2xl font-bold ${theme.text}`}>{totalDuration}</div>
        </div>
        <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4 text-center`}>
          <div className="text-sm text-gray-600 mb-1">קלוריות</div>
          <div className={`text-2xl font-bold ${theme.text}`}>{totalCalories}</div>
        </div>
      </div>

      {/* בחירה מהירה - 18 אימונים */}
      <div className="bg-white border-2 border-gray-100 rounded-lg p-4 shadow-sm">
        <h3 className={`font-bold ${theme.text} mb-3`}>אימון מהיר</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {exercisesList.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => addExercise(ex)}
              className="flex flex-col items-center justify-center p-2 rounded-lg border hover:bg-orange-50 hover:border-orange-300 transition-colors text-xs text-center h-20"
            >
              <span className="text-xl mb-1">{ex.icon}</span>
              <span className="font-medium text-gray-700 leading-tight">{ex.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* טופס הוספה ידני */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-lg p-4`}>
        <h3 className={`font-bold ${theme.text} mb-3`}>הוספה ידנית</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="שם האימון (למשל: סקווש)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="דקות"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="קלוריות"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => addExercise()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Dumbbell className="w-5 h-5" />
            הוסף אימון
          </button>
        </div>
      </div>

      {/* היסטוריה */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          היסטוריית אימונים
        </h3>
        
        {exerciseRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>אין רשומות אימונים עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...exerciseRecords].reverse().map(record => (
              <div key={record.id} className={`${theme.bg} border-2 ${theme.border} rounded-lg p-4`}>
                {editingId === record.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded p-2"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="flex-1 border-2 border-gray-300 rounded p-2"
                        placeholder="דקות"
                      />
                      <input
                        type="number"
                        value={editCalories}
                        onChange={(e) => setEditCalories(e.target.value)}
                        className="flex-1 border-2 border-gray-300 rounded p-2"
                        placeholder="קלוריות"
                      />
                    </div>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded p-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(record.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg flex justify-center items-center gap-2">
                        <Check className="w-4 h-4" /> שמור
                      </button>
                      <button onClick={cancelEdit} className="flex-1 bg-gray-500 text-white py-2 rounded-lg flex justify-center items-center gap-2">
                        <X className="w-4 h-4" /> ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800 text-lg">{record.name}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {formatDate(record.date)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {record.duration} דק'</span>
                        <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> {record.calories} קק״ל</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(record)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteRecord(record.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <TipsWidget activeTab="exercise" />
    </div>
  );
};

export default ExerciseTab;
