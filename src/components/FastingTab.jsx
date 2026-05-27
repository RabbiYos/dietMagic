import React, { useEffect, useMemo, useState } from 'react';
import {
  PlayCircle,
  StopCircle,
  Clock,
  Trash2,
  Edit2,
  Check,
  X,
  Flame,
  Activity,
  Timer,
  Flame as FlameIcon,
} from 'lucide-react';
import { formatTime, formatDate, calculateDuration } from '../utils/dateUtils';
import { getFastingStage, calculateBurnedCalories } from '../data/fastingData';
import TipsWidget from './TipsWidget';
import AchievementBadge from './AchievementBadge';

const pad2 = (n) => String(n ?? 0).padStart(2, '0');

const formatDurationHHMM = (startTime, endTime) => {
  const d = calculateDuration(startTime, endTime);
  return `${pad2(d.hours)}:${pad2(d.minutes)}`;
};

const getWeekdayHe = (ts) => {
  const day = new Date(ts).getDay();
  const map = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return map[day] || '';
};

const formatHoursToHHMM = (hoursFloat) => {
  const totalMinutes = Math.round((hoursFloat || 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const FastingTab = ({
  fastingRecords,
  setFastingRecords,
  isFasting,
  setIsFasting,
  fastingStart,
  setFastingStart,
}) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // History view
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Edit history record
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  // Edit active fasting start time
  const [isEditingFastingStart, setIsEditingFastingStart] = useState(false);
  const [tempFastingStart, setTempFastingStart] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startFast = () => {
    setIsFasting(true);
    setFastingStart(Date.now());
  };

  const endFast = () => {
    if (!fastingStart) return;
    const newRecord = { id: Date.now(), startTime: fastingStart, endTime: Date.now() };
    setFastingRecords([...fastingRecords, newRecord]);
    setIsFasting(false);
    setFastingStart(null);
    setIsEditingFastingStart(false);
    setTempFastingStart('');
  };

  const deleteRecord = (id) => {
    setFastingRecords(fastingRecords.filter((r) => r.id !== id));
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditStart(new Date(record.startTime).toISOString().slice(0, 16));
    setEditEnd(new Date(record.endTime).toISOString().slice(0, 16));
  };

  const saveEdit = (id) => {
    setFastingRecords(
      fastingRecords.map((record) =>
        record.id === id
          ? {
              ...record,
              startTime: new Date(editStart).getTime(),
              endTime: new Date(editEnd).getTime(),
            }
          : record
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const startEditFastingStart = () => {
    if (!fastingStart) return;
    const d = new Date(fastingStart);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    setTempFastingStart(local.toISOString().slice(0, 16));
    setIsEditingFastingStart(true);
  };

  const saveEditFastingStart = () => {
    if (!tempFastingStart) return;
    const newStart = new Date(tempFastingStart).getTime();
    if (Number.isNaN(newStart)) return;
    if (newStart > Date.now()) return;
    if (Date.now() - newStart > 7 * 24 * 60 * 60 * 1000) return;
    setFastingStart(newStart);
    setIsEditingFastingStart(false);
  };

  const cancelEditFastingStart = () => {
    setIsEditingFastingStart(false);
    setTempFastingStart('');
  };

  const adjustStartMinutes = (deltaMinutes) => {
    if (!fastingStart) return;
    const next = fastingStart + deltaMinutes * 60 * 1000;
    const clamped = Math.min(Date.now(), Math.max(0, next));
    setFastingStart(clamped);
  };

  const duration = useMemo(() => {
    if (!isFasting || !fastingStart) {
      return { hours: 0, minutes: 0, seconds: 0, totalHours: 0 };
    }
    return calculateDuration(fastingStart, currentTime);
  }, [isFasting, fastingStart, currentTime]);

  const stage = useMemo(() => getFastingStage(duration.totalHours || 0), [duration.totalHours]);

  const caloriesBurned = useMemo(
    () => calculateBurnedCalories(duration.totalHours || 0),
    [duration.totalHours]
  );

  const totalFasts = fastingRecords.length;

  const avgHours = useMemo(() => {
    if (totalFasts === 0) return '0.0';
    const total = fastingRecords.reduce((sum, r) => {
      const d = calculateDuration(r.startTime, r.endTime);
      return sum + (d.totalHours ?? d.hours ?? 0);
    }, 0);
    return (total / totalFasts).toFixed(1);
  }, [fastingRecords, totalFasts]);
  
  const avgDurationHHMM = formatHoursToHHMM(Number(avgHours));


  const visibleRecords = useMemo(() => {
    const sorted = [...fastingRecords].reverse();
    return showAllHistory ? sorted : sorted.slice(0, 10);
  }, [fastingRecords, showAllHistory]);

  const hasMoreThan10 = fastingRecords.length > 10;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-bold text-gray-800">
            {isFasting ? (
              <span className="text-blue-600 font-mono">
                {String(duration.hours).padStart(2, '0')}:{String(duration.minutes).padStart(2, '0')}:
                {String(duration.seconds ?? 0).padStart(2, '0')}
              </span>
            ) : (
              <span>לא בצום כרגע</span>
            )}
          </div>

          {isFasting ? (
            <button
              onClick={endFast}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2"
            >
              <StopCircle className="w-5 h-5" />
              סיים צום
            </button>
          ) : (
            <button
              onClick={startFast}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              התחל צום
            </button>
          )}
        </div>
      </div>

      {/* Active fasting cards */}
      {isFasting && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Calories */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-5">
            <div
              dir="rtl"
              className="w-full text-right flex items-center justify-start gap-2 text-base font-bold text-blue-900 mb-3"
            >
              <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span>הערכה - נשרפו עד עכשיו</span>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 leading-none">{caloriesBurned}</div>
              <div className="text-sm text-gray-600 mb-1">קלוריות</div>
            </div>
          </div>

          {/* Start time */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-5">
            <div
              dir="rtl"
              className="w-full text-right flex items-center justify-start gap-2 text-base font-bold text-blue-900 mb-3"
            >
              <Clock className="w-5 h-5 text-blue-700 flex-shrink-0" />
              <span>התחלת הצום</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="text-3xl font-bold text-blue-900">{formatTime(fastingStart)}</div>

              {!isEditingFastingStart && (
                <button
                  onClick={startEditFastingStart}
                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  title="עריכה"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => adjustStartMinutes(60)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-3 rounded-lg font-bold border-2 border-blue-200"
              >
                +60
              </button>
              <button
                onClick={() => adjustStartMinutes(10)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-3 rounded-lg font-bold border-2 border-blue-200"
              >
                +10
              </button>
              <button
                onClick={() => adjustStartMinutes(-10)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-3 rounded-lg font-bold border-2 border-blue-200"
              >
                -10
              </button>
              <button
                onClick={() => adjustStartMinutes(-60)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-3 rounded-lg font-bold border-2 border-blue-200"
              >
                -60
              </button>
            </div>

            {isEditingFastingStart && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-600 mb-2">עריכת שעת התחלה</div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="datetime-local"
                    value={tempFastingStart}
                    onChange={(e) => setTempFastingStart(e.target.value)}
                    className="w-full sm:flex-1 min-w-0 border-2 border-gray-300 rounded-lg px-3 py-2 text-base bg-white"
                  />
                  <button
                    onClick={saveEditFastingStart}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    שמור
                  </button>
                  <button
                    onClick={cancelEditFastingStart}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    בטל
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stage */}
      {isFasting && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-right">
          <div className="text-xl font-bold text-gray-800 mb-2">
            <span className="text-blue-900">השלב הנוכחי בצום:</span> {stage.title}
          </div>
          <div className="text-base text-gray-700 leading-relaxed">{stage.description}</div>
        </div>
      )}

      {/* Achievements (includes avg) */}
      <AchievementBadge
        fastingRecords={fastingRecords}
        avgHours={avgHours}
        avgDurationHHMM={avgDurationHHMM}
      />


      {/* Tip */}
      <TipsWidget activeTab="fasting" />

      {/* History */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          היסטוריית צומות
        </h3>

        {fastingRecords.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-base">אין רשומות צום עדיין</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleRecords.map((record) => {
                const durationHHMM = formatDurationHHMM(record.startTime, record.endTime);
                const recDuration = calculateDuration(record.startTime, record.endTime);
                const recCalories = calculateBurnedCalories(recDuration.totalHours || 0);
                const weekday = getWeekdayHe(record.startTime);

                return (
                  <div
                    key={record.id}
                    className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4"
                    dir="rtl"
                  >
                    {editingId === record.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-sm text-gray-600">התחלה</label>
                            <input
                              type="datetime-local"
                              value={editStart}
                              onChange={(e) => setEditStart(e.target.value)}
                              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">סיום</label>
                            <input
                              type="datetime-local"
                              value={editEnd}
                              onChange={(e) => setEditEnd(e.target.value)}
                              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(record.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            שמור
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            בטל
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3" dir="rtl">
                        {/* actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(record)}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors"
                            title="עריכה"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                            title="מחיקה"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* center */}
                        <div className="flex items-center justify-center gap-6">
                          <span className="inline-flex items-center gap-2 font-bold text-blue-700 text-xl">
                            <Timer className="w-5 h-5 text-blue-600" />
                            {durationHHMM}
                          </span>

                          <span className="inline-flex items-center gap-2 font-bold text-orange-500 text-xl">
                            <FlameIcon className="w-5 h-5 text-orange-500" />
                            {recCalories}
                          </span>
                        </div>

                        {/* details */}
                        <div className="text-right">
                          <div className="text-base text-gray-600 whitespace-nowrap">
                            {weekday}, {formatDate(record.startTime)} • {formatTime(record.startTime)}-
                            {formatTime(record.endTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showAllHistory && hasMoreThan10 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAllHistory(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
                >
                  הצג עוד
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FastingTab;
