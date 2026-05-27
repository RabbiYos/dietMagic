const isInLast7Days = (dateMs, nowMs) => {
  const d = Number(dateMs);
  if (!d) return false;
  return d >= nowMs - 7 * 24 * 60 * 60 * 1000;
};

export const getWeeklyData = ({
  fastingRecords = [],
  weightRecords = [],
  stepsRecords = [],
  waterRecords = [],
  exerciseRecords = []
}) => {
  const nowMs = Date.now();

  const weeklyFasts = fastingRecords.filter(r => isInLast7Days(r.startTime ?? r.date, nowMs));
  const avgFastHours =
    weeklyFasts.length > 0
      ? weeklyFasts.reduce((sum, r) => sum + (Number(r.duration) || 0), 0) / weeklyFasts.length / 3600
      : 0;

  const weeklyWeights = weightRecords.filter(r => isInLast7Days(r.date, nowMs));
  const weightChange =
    weeklyWeights.length >= 2
      ? Number(weeklyWeights[0].weight ?? weeklyWeights[0].value) -
        Number(weeklyWeights[weeklyWeights.length - 1].weight ?? weeklyWeights[weeklyWeights.length - 1].value)
      : 0;

  const weeklySteps = stepsRecords.filter(r => isInLast7Days(r.date, nowMs));
  const totalSteps = weeklySteps.reduce((sum, r) => sum + (Number(r.steps ?? r.value) || 0), 0);
  const avgSteps = weeklySteps.length > 0 ? totalSteps / weeklySteps.length : 0;

  const weeklyWater = waterRecords.filter(r => isInLast7Days(r.date, nowMs));
  const totalWater = weeklyWater.reduce((sum, r) => sum + (Number(r.amount ?? r.value) || 0), 0);
  const avgWater = weeklyWater.length > 0 ? totalWater / weeklyWater.length : 0;

  const weeklyExercises = exerciseRecords.filter(r => isInLast7Days(r.date, nowMs));
  const totalExerciseTime = weeklyExercises.reduce((sum, r) => sum + (Number(r.duration) || 0), 0);
  const totalCalories = weeklyExercises.reduce((sum, r) => sum + (Number(r.calories) || 0), 0);

  return {
    fasts: { count: weeklyFasts.length, avgDuration: avgFastHours },
    steps: { total: totalSteps, avg: avgSteps, count: weeklySteps.length },
    water: { total: totalWater, avg: avgWater, count: weeklyWater.length },
    exercises: { count: weeklyExercises.length, totalTime: totalExerciseTime, totalCalories },
    weight: { change: weightChange, count: weeklyWeights.length }
  };
};
