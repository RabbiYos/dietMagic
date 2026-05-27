export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('he-IL');
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('he-IL');
};

export const getStartOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

export const calculateDuration = (startTime, endTime) => {
  const durationMs = Math.max(0, endTime - startTime);

  const totalSeconds = Math.floor(durationMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = totalMinutes / 60;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalMinutes, totalHours };
};

export const startOfDayMs = (ms) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getStartOfWeekMs = (ms = Date.now()) => {
  const d = new Date(ms);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getStartOfMonthMs = (ms = Date.now()) => {
  const d = new Date(ms);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getPreviousWeekRangeMs = (ms = Date.now()) => {
  const startThisWeek = getStartOfWeekMs(ms);
  const startPrevWeek = startThisWeek - 7 * 24 * 60 * 60 * 1000;
  const endPrevWeek = startThisWeek - 1;
  return { startMs: startPrevWeek, endMs: endPrevWeek };
};

export const getPreviousMonthRangeMs = (ms = Date.now()) => {
  const d = new Date(ms);
  const startThisMonth = getStartOfMonthMs(ms);

  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  const startPrevMonth = d.getTime();

  const endPrevMonth = startThisMonth - 1;
  return { startMs: startPrevMonth, endMs: endPrevMonth };
};
