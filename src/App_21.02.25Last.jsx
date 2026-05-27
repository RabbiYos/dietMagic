import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Weight, TrendingUp, Footprints, Dumbbell, PlayCircle, StopCircle, History, Trash2, Edit2, Check, X, BarChart3, Award, Target } from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import { tipsData, getCategoryByTab } from './tipsData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const getThemeColor = (tab) => {
  switch (tab) {
    case 'fasting': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' };
    case 'weight': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' };
    case 'water': return { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' };
    case 'steps': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconBg: 'bg-green-100', iconColor: 'text-green-600' };
    case 'exercise': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' };
    default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', iconBg: 'bg-gray-100', iconColor: 'text-gray-600' };
  }
};

const TipsWidget = ({ activeTab }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const theme = getThemeColor(activeTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      const relevantCategories = getCategoryByTab(activeTab);
      const filteredTips = tipsData.filter(tip => relevantCategories.includes(tip.category));

      if (filteredTips.length > 0) {
        const randomTip = filteredTips[Math.floor(Math.random() * filteredTips.length)];
        setCurrentTip(randomTip);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (!currentTip) return null;

  return (
    <div className={`mt-8 p-6 rounded-lg border ${theme.bg} ${theme.border} transition-all duration-300 shadow-sm`}>
      {/* שינוי: items-center במקום items-start */}
      <div className="flex items-center gap-4"> 
        <div className={`p-3 rounded-full ${theme.iconBg} ${theme.iconColor} shrink-0`}>
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <p className={`text-lg font-medium leading-relaxed ${theme.text} m-0`}>
             {currentTip.text.replace(/\.$/, '')}
          </p>
        </div>
      </div>
    </div>
  ); 
};

export default function FastingHealthTracker() {
  const [activeTab, setActiveTab] = useState('fasting');
  const [fasting, setFasting] = useState(() => {
    const saved = localStorage.getItem('activeFasting');
    return saved ? JSON.parse(saved) : { active: false, startTime: null, duration: 0 };
  });
  const [editingStartTime, setEditingStartTime] = useState(false);
  const [tempStartTime, setTempStartTime] = useState('');
  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');
  const [exercise, setExercise] = useState({ type: '', duration: '', calories: '' });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('healthTrackerHistory');
    return saved ? JSON.parse(saved) : {
      fasts: [],
      weights: [],
      steps: [],
      water: [],
      exercises: []
    };
  });

  useEffect(() => {
    localStorage.setItem('activeFasting', JSON.stringify(fasting));
  }, [fasting]);

  useEffect(() => {
    localStorage.setItem('healthTrackerHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval;
    if (fasting.active && fasting.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - fasting.startTime) / 1000);
        setFasting(prev => ({ ...prev, duration: elapsed }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fasting.active, fasting.startTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getWeeklyData = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyFasts = (history.fasts || []).filter(f => new Date(f.startTime) >= weekAgo);
    const weeklyWeights = (history.weights || []).filter(w => new Date(w.date.split('.').reverse().join('-')) >= weekAgo);
    const weeklySteps = (history.steps || []).filter(s => new Date(s.date.split('.').reverse().join('-')) >= weekAgo);
    const weeklyWater = (history.water || []).filter(w => new Date(w.date.split('.').reverse().join('-')) >= weekAgo);
    const weeklyExercises = (history.exercises || []).filter(e => new Date(e.date.split('.').reverse().join('-')) >= weekAgo);

    const avgFastDuration = weeklyFasts.length > 0 
      ? weeklyFasts.reduce((sum, f) => sum + f.duration, 0) / weeklyFasts.length / 3600 
      : 0;
    
    const totalSteps = weeklySteps.reduce((sum, s) => sum + s.value, 0);
    const avgSteps = weeklySteps.length > 0 ? totalSteps / weeklySteps.length : 0;
    
    const totalWater = weeklyWater.reduce((sum, w) => sum + w.value, 0);
    const avgWater = weeklyWater.length > 0 ? totalWater / weeklyWater.length : 0;
    
    const totalExerciseTime = weeklyExercises.reduce((sum, e) => sum + e.duration, 0);
    const totalCalories = weeklyExercises.reduce((sum, e) => sum + e.calories, 0);

    const weightChange = weeklyWeights.length >= 2 
      ? weeklyWeights[0].value - weeklyWeights[weeklyWeights.length - 1].value 
      : 0;

    return {
      fasts: { count: weeklyFasts.length, avgDuration: avgFastDuration },
      steps: { total: totalSteps, avg: avgSteps, count: weeklySteps.length },
      water: { total: totalWater, avg: avgWater, count: weeklyWater.length },
      exercises: { count: weeklyExercises.length, totalTime: totalExerciseTime, totalCalories },
      weight: { change: weightChange, count: weeklyWeights.length }
    };
  };

  const getFastingStage = (hours) => {
    if (hours < 4) {
      return {
        title: 'שלב עיכול מוקדם',
        description: 'הגוף עדיין מעכל את הארוחה האחרונה. רמות הסוכר והאינסולין יורדות בהדרגה.',
        color: 'bg-blue-50 border-blue-200',
        icon: '🍽️'
      };
    } else if (hours < 8) {
      return {
        title: 'שלב עיכול מאוחר',
        description: 'רמות הסוכר בדם מתייצבות. הגוף מתחיל לעבור למצב צריכת אנרגיה מהמאגרים.',
        color: 'bg-green-50 border-green-200',
        icon: '⚡'
      };
    } else if (hours < 12) {
      return {
        title: 'שריפת שומן מוקדמת',
        description: 'הגוף עובר למצב קטוזיס קל. מתחיל לשרוף שומן כמקור אנרגיה עיקרי.',
        color: 'bg-yellow-50 border-yellow-200',
        icon: '🔥'
      };
    } else if (hours < 16) {
      return {
        title: 'קטוזיס מוגבר',
        description: 'שריפת שומן באופן אינטנסיבי. האנרגיה והריכוז משתפרים. תהליכי הניקוי התאי מואצים.',
        color: 'bg-orange-50 border-orange-200',
        icon: '💪'
      };
    } else if (hours < 24) {
      return {
        title: 'אוטופגיה מוקדמת',
        description: 'תהליכי אוטופגיה - הגוף מנקה תאים פגומים. HGH (הורמון גדילה) עולה משמעותית.',
        color: 'bg-purple-50 border-purple-200',
        icon: '🧬'
      };
    } else if (hours < 48) {
      return {
        title: 'אוטופגיה מלאה',
        description: 'תהליכי התחדשות תאית בשיא. מערכת החיסון מתחזקת. ייצור תאי גזע עולה.',
        color: 'bg-pink-50 border-pink-200',
        icon: '✨'
      };
    } else {
      return {
        title: 'צום ממושך',
        description: 'הגוף במצב ריפוי עצמי עמוק. מומלץ להתייעץ עם איש מקצוע בריאות.',
        color: 'bg-red-50 border-red-200',
        icon: '🌟'
      };
    }
  };

  const startFast = () => {
    setFasting({ active: true, startTime: Date.now(), duration: 0 });
  };

  const endFast = () => {
    if (fasting.active) {
      const fastRecord = {
        id: Date.now(),
        startTime: fasting.startTime,
        endTime: Date.now(),
        duration: fasting.duration,
        date: new Date().toLocaleDateString('he-IL')
      };
      setHistory(prev => ({ ...prev, fasts: [fastRecord, ...prev.fasts] }));
      setFasting({ active: false, startTime: null, duration: 0 });
    }
  };

  const startEditingTime = () => {
    const date = new Date(fasting.startTime);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    const formatted = localDate.toISOString().slice(0, 16);
    setTempStartTime(formatted);
    setEditingStartTime(true);
  };

  const saveEditedTime = () => {
    if (tempStartTime) {
      const newStartTime = new Date(tempStartTime).getTime();
      setFasting(prev => ({ ...prev, startTime: newStartTime }));
      setEditingStartTime(false);
    }
  };

  const cancelEditingTime = () => {
    setEditingStartTime(false);
    setTempStartTime('');
  };

  const logWeight = () => {
    if (weight && !isNaN(weight)) {
      const weightRecord = {
        id: Date.now(),
        value: parseFloat(weight),
        date: new Date().toLocaleDateString('he-IL'),
        time: new Date().toLocaleTimeString('he-IL')
      };
      setHistory(prev => ({ ...prev, weights: [weightRecord, ...prev.weights] }));
      setWeight('');
    }
  };

  const logSteps = () => {
    if (steps && !isNaN(steps)) {
      const stepsRecord = {
        id: Date.now(),
        value: parseInt(steps),
        date: new Date().toLocaleDateString('he-IL')
      };
      setHistory(prev => ({ ...prev, steps: [stepsRecord, ...prev.steps] }));
      setSteps('');
    }
  };

  const logWater = () => {
    if (water && !isNaN(water)) {
      const waterRecord = {
        id: Date.now(),
        value: parseInt(water),
        date: new Date().toLocaleDateString('he-IL'),
        time: new Date().toLocaleTimeString('he-IL')
      };
      setHistory(prev => ({ ...prev, water: [waterRecord, ...prev.water] }));
      setWater('');
    }
  };

  const logExercise = () => {
    if (exercise.type && exercise.duration) {
      const exerciseRecord = {
        id: Date.now(),
        type: exercise.type,
        duration: parseInt(exercise.duration),
        calories: exercise.calories ? parseInt(exercise.calories) : 0,
        date: new Date().toLocaleDateString('he-IL'),
        time: new Date().toLocaleTimeString('he-IL')
      };
      setHistory(prev => ({ ...prev, exercises: [exerciseRecord, ...prev.exercises] }));
      setExercise({ type: '', duration: '', calories: '' });
    }
  };

  const deleteRecord = (category, id) => {
    setHistory(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const currentHours = fasting.duration / 3600;
  const stage = getFastingStage(currentHours);
  const weeklyData = getWeeklyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🏃‍♂️ מעקב בריאות וצום</h1>
        
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { key: 'summary', label: '📊 סיכום', icon: BarChart3 },
              { key: 'fasting', label: '⏱️ צום', icon: Clock },
              { key: 'weight', label: '⚖️ משקל', icon: Weight },
              { key: 'water', label: '💧 שתייה', icon: TrendingUp },
              { key: 'steps', label: '👣 צעדים', icon: Footprints },
              { key: 'exercise', label: '💪 אימון', icon: Dumbbell },
              { key: 'history', label: '📜 היסטוריה', icon: History }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-semibold">סיכום שבועי</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fasting Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-3xl">⏱️</div>
                      <h3 className="text-xl font-bold text-blue-800">צום</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">מספר צומות:</span>
                        <span className="font-bold text-blue-700">{weeklyData.fasts.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ממוצע שעות:</span>
                        <span className="font-bold text-blue-700">{weeklyData.fasts.avgDuration.toFixed(1)} שעות</span>
                      </div>
                      {weeklyData.fasts.count > 0 && (
                        <div className="mt-3 text-sm text-blue-600">
                          🎯 כל הכבוד! המשך כך
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weight Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-3xl">⚖️</div>
                      <h3 className="text-xl font-bold text-purple-800">משקל</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">מספר שקילות:</span>
                        <span className="font-bold text-purple-700">{weeklyData.weight.count}</span>
                      </div>
                      {weeklyData.weight.count >= 2 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">שינוי:</span>
                          <span className={`font-bold ${weeklyData.weight.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {weeklyData.weight.change > 0 ? '+' : ''}{weeklyData.weight.change.toFixed(1)} ק״ג
                          </span>
                        </div>
                      )}
                      {weeklyData.weight.change < 0 && (
                        <div className="mt-3 text-sm text-green-600">
                          ✨ מעולה! ירידה במשקל
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Steps Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-3xl">👣</div>
                      <h3 className="text-xl font-bold text-green-800">צעדים</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">סה״כ צעדים:</span>
                        <span className="font-bold text-green-700">{weeklyData.steps.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ממוצע יומי:</span>
                        <span className="font-bold text-green-700">{Math.round(weeklyData.steps.avg).toLocaleString()}</span>
                      </div>
                      {weeklyData.steps.avg >= 10000 && (
                        <div className="mt-3 text-sm text-green-600">
                          🏆 יעד 10,000 צעדים הושג!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Water Summary */}
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-lg border-2 border-cyan-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-3xl">💧</div>
                      <h3 className="text-xl font-bold text-cyan-800">שתייה</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">סה״כ שתייה:</span>
                        <span className="font-bold text-cyan-700">{weeklyData.water.total.toLocaleString()} מ״ל</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ממוצע יומי:</span>
                        <span className="font-bold text-cyan-700">{Math.round(weeklyData.water.avg).toLocaleString()} מ״ל</span>
                      </div>
                      {weeklyData.water.avg >= 2000 && (
                        <div className="mt-3 text-sm text-cyan-600">
                          💦 מעולה! שומר על הידרציה
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exercise Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-3xl">💪</div>
                      <h3 className="text-xl font-bold text-orange-800">אימונים</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">מספר אימונים:</span>
                        <span className="font-bold text-orange-700">{weeklyData.exercises.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">סה״כ דקות:</span>
                        <span className="font-bold text-orange-700">{weeklyData.exercises.totalTime}</span>
                      </div>
                      {weeklyData.exercises.totalCalories > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">סה״כ קלוריות:</span>
                          <span className="font-bold text-orange-700">{weeklyData.exercises.totalCalories}</span>
                        </div>
                      )}
                      {weeklyData.exercises.count >= 3 && (
                        <div className="mt-3 text-sm text-orange-600">
                          🔥 מדהים! שומר על קצב
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg border-2 border-indigo-300 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-indigo-800">התקדמות כללית</h3>
                  </div>
                  <div className="text-lg text-gray-700 space-y-2">
                    {weeklyData.fasts.count > 0 && <p>✅ ביצעת {weeklyData.fasts.count} צומות השבוע</p>}
                    {weeklyData.steps.total > 0 && <p>✅ צעדת {weeklyData.steps.total.toLocaleString()} צעדים</p>}
                    {weeklyData.water.total > 0 && <p>✅ שתית {weeklyData.water.total.toLocaleString()} מ״ל מים</p>}
                    {weeklyData.exercises.count > 0 && <p>✅ השלמת {weeklyData.exercises.count} אימונים</p>}
                    {weeklyData.weight.change < 0 && <p>✅ ירדת {Math.abs(weeklyData.weight.change).toFixed(1)} ק״ג</p>}
                    
                    {weeklyData.fasts.count === 0 && weeklyData.steps.total === 0 && weeklyData.exercises.count === 0 && weeklyData.water.total === 0 && (
                      <p className="text-gray-500">התחל לתעד את הפעילות שלך כדי לראות התקדמות! 💪</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fasting' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{stage.icon}</div>
                  <h2 className="text-2xl font-semibold mb-2">צום לסירוגין</h2>
                  <div className="text-5xl font-bold text-gray-800 mb-4">
                    {formatTime(fasting.duration)}
                  </div>
                  {fasting.active ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-600">התחלה:</span>
                        {editingStartTime ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="datetime-local"
                              value={tempStartTime}
                              onChange={(e) => setTempStartTime(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded"
                            />
                            <button onClick={saveEditedTime} className="text-green-600 hover:text-green-700">
                              <Check className="w-5 h-5" />
                            </button>
                            <button onClick={cancelEditingTime} className="text-red-600 hover:text-red-700">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{new Date(fasting.startTime).toLocaleString('he-IL')}</span>
                            <button onClick={startEditingTime} className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${stage.color} text-right`}>
                        <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                        <p className="text-gray-700">{stage.description}</p>
                        <div className="mt-3 text-sm text-gray-600">
                          <strong>שעות צום:</strong> {currentHours.toFixed(1)}
                        </div>
                      </div>

                      <button
                        onClick={endFast}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                      >
                        <StopCircle className="w-5 h-5" />
                        סיום צום
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startFast}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                    >
                      <PlayCircle className="w-5 h-5" />
                      התחל צום
                    </button>
                  )}
                </div>

                {/* Fasting History */}
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    היסטוריית צום
                  </h3>
                  <div className="space-y-2">
                    {history.fasts.slice(0, 5).map(f => (
                      <div key={f.id} className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                        <button onClick={() => deleteRecord('fasts', f.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="text-right">
                          <div className="font-bold text-blue-700">{formatTime(f.duration)} ⏱️</div>
                          <div className="text-sm text-gray-600">{f.date}</div>
                        </div>
                      </div>
                    ))}
                    {history.fasts.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות צום עדיין</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'weight' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl">⚖️</div>
                  <h2 className="text-2xl font-semibold">מעקב משקל</h2>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="הזן משקל (ק״ג)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={logWeight}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    רשום משקל
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-500" />
                    היסטוריית משקל
                  </h3>
                  <div className="space-y-2">
                    {history.weights.map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-purple-50 p-3 rounded border border-purple-200">
                        <button onClick={() => deleteRecord('weights', w.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-purple-700">{w.value} ק״ג ⚖️ - {w.date} בשעה {w.time}</span>
                      </div>
                    ))}
                    {history.weights.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות עדיין</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'water' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl">💧</div>
                  <h2 className="text-2xl font-semibold">מעקב שתייה</h2>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    placeholder="הזן כמות במ״ל"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    onClick={logWater}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    רשום שתייה
                  </button>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setWater('250'); logWater(); }}
                    className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-4 py-3 rounded-lg font-medium border-2 border-cyan-300"
                  >
                    כוס 250 מ״ל
                  </button>
                  <button
                    onClick={() => { setWater('500'); logWater(); }}
                    className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-4 py-3 rounded-lg font-medium border-2 border-cyan-300"
                  >
                    בקבוק 500 מ״ל
                  </button>
                  <button
                    onClick={() => { setWater('1000'); logWater(); }}
                    className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-4 py-3 rounded-lg font-medium border-2 border-cyan-300"
                  >
                    ליטר 1000 מ״ל
                  </button>
                </div>

                {/* Daily Goal Progress */}
                {(history.water || []).length > 0 && (() => {
                  const today = new Date().toLocaleDateString('he-IL');
                  const todayWater = (history.water || [])
                    .filter(w => w.date === today)
                    .reduce((sum, w) => sum + w.value, 0);
                  const goal = 2000; // 2 liters
                  const percentage = Math.min((todayWater / goal) * 100, 100);

                  return (
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200">
                      <h3 className="font-bold text-cyan-800 mb-2">יעד יומי: 2000 מ״ל</h3>
                      <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && `${Math.round(percentage)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>שתית היום: {todayWater.toLocaleString()} מ״ל</span>
                        <span>נותר: {Math.max(goal - todayWater, 0).toLocaleString()} מ״ל</span>
                      </div>
                      {todayWater >= goal && (
                        <div className="mt-3 text-center text-cyan-600 font-bold">
                          🎉 כל הכבוד! הגעת ליעד היומי!
                        </div>
                      )}
                    </div>
                  );
                })()}
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <History className="w-5 h-5 text-cyan-500" />
                    היסטוריית שתייה
                  </h3>
                  <div className="space-y-2">
                    {(history.water || []).map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-cyan-50 p-3 rounded border border-cyan-200">
                        <button onClick={() => deleteRecord('water', w.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-cyan-700">{w.value.toLocaleString()} מ״ל 💧 - {w.date} בשעה {w.time}</span>
                      </div>
                    ))}
                    {(history.water || []).length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות עדיין</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl">👣</div>
                  <h2 className="text-2xl font-semibold">מעקב צעדים</h2>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="הזן מספר צעדים"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={logSteps}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    רשום צעדים
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <History className="w-5 h-5 text-green-500" />
                    היסטוריית צעדים
                  </h3>
                  <div className="space-y-2">
                    {history.steps.map(s => (
                      <div key={s.id} className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200">
                        <button onClick={() => deleteRecord('steps', s.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-green-700">{s.value.toLocaleString()} צעדים 👣 - {s.date}</span>
                      </div>
                    ))}
                    {history.steps.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות עדיין</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exercise' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl">💪</div>
                  <h2 className="text-2xl font-semibold">מעקב אימונים</h2>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={exercise.type}
                    onChange={(e) => setExercise(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="סוג אימון (לדוגמה: ריצה, רכיבה)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={exercise.duration}
                      onChange={(e) => setExercise(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="משך (דקות)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={exercise.calories}
                      onChange={(e) => setExercise(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="קלוריות (אופציונלי)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={logExercise}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    רשום אימון
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <History className="w-5 h-5 text-orange-500" />
                    היסטוריית אימונים
                  </h3>
                  <div className="space-y-2">
                    {history.exercises.map(ex => (
                      <div key={ex.id} className="flex justify-between items-center bg-orange-50 p-3 rounded border border-orange-200">
                        <button onClick={() => deleteRecord('exercises', ex.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="text-right">
                          <div className="font-bold text-orange-700">{ex.type} 💪</div>
                          <div className="text-sm text-gray-600">
                            {ex.duration} דק׳ {ex.calories > 0 && `• ${ex.calories} קל׳ 🔥`} • {ex.date} בשעה {ex.time}
                          </div>
                        </div>
                      </div>
                    ))}
                    {history.exercises.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות עדיין</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl">📜</div>
                  <h2 className="text-2xl font-semibold">היסטוריה מלאה</h2>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="text-2xl">⏱️</div>
                    היסטוריית צום ({history.fasts.length})
                  </h3>
                  <div className="space-y-2">
                    {history.fasts.map(f => (
                      <div key={f.id} className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                        <button onClick={() => deleteRecord('fasts', f.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="text-right">
                          <div className="font-bold text-blue-700">{formatTime(f.duration)} ⏱️</div>
                          <div className="text-sm text-gray-600">{f.date}</div>
                        </div>
                      </div>
                    ))}
                    {history.fasts.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות צום עדיין</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="text-2xl">⚖️</div>
                    היסטוריית משקל ({history.weights.length})
                  </h3>
                  <div className="space-y-2">
                    {history.weights.map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-purple-50 p-3 rounded border border-purple-200">
                        <button onClick={() => deleteRecord('weights', w.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-purple-700">{w.value} ק״ג ⚖️ - {w.date}</span>
                      </div>
                    ))}
                    {history.weights.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות משקל עדיין</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="text-2xl">👣</div>
                    היסטוריית צעדים ({history.steps.length})
                  </h3>
                  <div className="space-y-2">
                    {history.steps.map(s => (
                      <div key={s.id} className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200">
                        <button onClick={() => deleteRecord('steps', s.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-green-700">{s.value.toLocaleString()} צעדים 👣 - {s.date}</span>
                      </div>
                    ))}
                    {history.steps.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות צעדים עדיין</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="text-2xl">💧</div>
                    היסטוריית שתייה ({(history.water || []).length})
                  </h3>
                  <div className="space-y-2">
                    {(history.water || []).map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-cyan-50 p-3 rounded border border-cyan-200">
                        <button onClick={() => deleteRecord('water', w.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-cyan-700">{w.value.toLocaleString()} מ״ל 💧 - {w.date}</span>
                      </div>
                    ))}
                    {(history.water || []).length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות שתייה עדיין</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="text-2xl">💪</div>
                    היסטוריית אימונים ({history.exercises.length})
                  </h3>
                  <div className="space-y-2">
                    {history.exercises.map(ex => (
                      <div key={ex.id} className="flex justify-between items-center bg-orange-50 p-3 rounded border border-orange-200">
                        <button onClick={() => deleteRecord('exercises', ex.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="text-right">
                          <div className="font-bold text-orange-700">{ex.type} 💪</div>
                          <div className="text-sm text-gray-600">
                            {ex.duration} דק׳ {ex.calories > 0 && `• ${ex.calories} קל׳ 🔥`} • {ex.date}
                          </div>
                        </div>
                      </div>
                    ))}
                    {history.exercises.length === 0 && <p className="text-gray-500 text-sm text-center">אין רשומות אימונים עדיין</p>}
                  </div>
                </div>
              </div>
            )}

             {/* Tips Section */}
            <TipsWidget activeTab={activeTab} />
          </div>
        </div>

       
      </div>
    </div>
  );
}