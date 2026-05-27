export const calculateBMI = (weight, heightCm) => {
  const w = Number(weight);
  const h = Number(heightCm);
  if (!w || !h) return null;
  const hm = h / 100;
  return Number((w / (hm * hm)).toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (bmi == null) return '';
  if (bmi < 18.5) return 'תת משקל';
  if (bmi < 25) return 'משקל תקין';
  if (bmi < 30) return 'עודף משקל';
  return 'השמנה';
};

export const getBMIColor = (bmi) => {
  if (bmi == null) return 'text-gray-600';
  if (bmi < 18.5) return 'text-blue-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  return 'text-red-600';
};

// צעדים
export const calculateCaloriesBurnedFromSteps = (steps) => {
  const s = Number(steps) || 0;
  return Math.round(s * 0.04);
};

export function calculateCaloriesBurned(steps, weightKg = 70) {
  const s = Number(steps) || 0;
  const w = Number(weightKg) || 70;

  // הערכה גסה: 0.04–0.06 קק"ל לצעד לאדם ממוצע; מותאם משקל בצורה ליניארית
  const caloriesPerStep = 0.05 * (w / 70);

  return Math.round(s * caloriesPerStep);
}

export function calculateDistance(steps, stepLengthMeters = 0.78) {
  const s = Number(steps) || 0;
  const stepLen = Number(stepLengthMeters) || 0.78;

  // מחזיר ק"מ
  return (s * stepLen) / 1000;
}

export const calculateDistanceKmFromSteps = (steps) => {
  const s = Number(steps) || 0;
  return Number((s * 0.0008).toFixed(2));
};

// צום — הערכה פשוטה (לשדרוג בעתיד)
// ברירת מחדל: 70 ק״ג, BMR ~ 1700
export const estimateFastingCaloriesBurned = ({
  fastingMs,
  weightKg = 70,
  bmrPerDay = 1700
}) => {
  const ms = Number(fastingMs) || 0;
  if (ms <= 0) return 0;

  // Scaling עדין לפי משקל (לא מדויק, אבל נותן תחושה)
  const weightFactor = Math.max(0.7, Math.min(1.4, weightKg / 70));
  const perDay = bmrPerDay * weightFactor;

  const hours = ms / (1000 * 60 * 60);
  const burned = (perDay / 24) * hours;
  return Math.round(burned);
};

// משקל — קצב והגעה ליעד
export const getWeightDeltaFromFirst = (weightRecords) => {
  if (!Array.isArray(weightRecords) || weightRecords.length < 2) return null;

  const sorted = [...weightRecords].sort((a, b) => a.date - b.date);
  const first = Number(sorted[0]?.weight);
  const last = Number(sorted[sorted.length - 1]?.weight);

  if (!first || !last) return null;

  const deltaKg = Number((last - first).toFixed(1));
  const deltaPct = Number(((deltaKg / first) * 100).toFixed(1));
  return { first, current: last, deltaKg, deltaPct };
};

// קצב נוכחי: שינוי ק״ג ליום לפי שתי נקודות אחרונות (אם קיימות)
// אם אין 2 נקודות: null
export const estimateWeightTrendKgPerDay = (weightRecords) => {
  if (!Array.isArray(weightRecords) || weightRecords.length < 2) return null;

  const sorted = [...weightRecords].sort((a, b) => a.date - b.date);
  const prev = sorted[sorted.length - 2];
  const last = sorted[sorted.length - 1];

  const w1 = Number(prev?.weight);
  const w2 = Number(last?.weight);
  const t1 = Number(prev?.date);
  const t2 = Number(last?.date);

  if (!w1 || !w2 || !t1 || !t2 || t2 <= t1) return null;

  const days = (t2 - t1) / (1000 * 60 * 60 * 24);
  if (days <= 0) return null;

  return (w2 - w1) / days; // חיובי = עלייה, שלילי = ירידה
};

export const estimateDaysToTargetWeight = (weightRecords, targetWeight) => {
  const target = Number(targetWeight);
  if (!target) return null;
  if (!Array.isArray(weightRecords) || weightRecords.length < 2) return null;

  const sorted = [...weightRecords].sort((a, b) => a.date - b.date);
  const current = Number(sorted[sorted.length - 1]?.weight);
  if (!current) return null;

  const kgPerDay = estimateWeightTrendKgPerDay(sorted);
  if (kgPerDay == null || kgPerDay === 0) return null;

  const remainingKg = target - current;

  // אם המגמה לא בכיוון היעד, אין “ימים להגעה”
  if ((remainingKg > 0 && kgPerDay <= 0) || (remainingKg < 0 && kgPerDay >= 0)) {
    return null;
  }

  const days = Math.ceil(Math.abs(remainingKg / kgPerDay));
  return days;
};
