import { useMemo } from 'react';
import { getStartOfWeek } from '../utils/dateUtils';

export const useWeeklyData = (fastingRecords, weightRecords, stepsRecords, waterRecords, exerciseRecords) => {
  return useMemo(() => {
    const startOfWeek = getStartOfWeek();

    // Calculate fasting data
    const weeklyFasts = fastingRecords.filter(
      record => new Date(record.startTime) >= startOfWeek
    );

    // Calculate weight change
    const weeklyWeightRecords = weightRecords.filter(
      record => new Date(record.date) >= startOfWeek
    );
    const firstWeight = weeklyWeightRecords.length > 0 ? weeklyWeightRecords[0].weight : 0;
    const lastWeight = weeklyWeightRecords.length > 0 
      ? weeklyWeightRecords[weeklyWeightRecords.length - 1].weight 
      : 0;
    const weightChange = lastWeight - firstWeight;

    // Calculate steps
    const weeklySteps = stepsRecords.filter(
      record => new Date(record.date) >= startOfWeek
    );
    const totalSteps = weeklySteps.reduce((sum, record) => sum + record.steps, 0);

    // Calculate water
    const weeklyWater = waterRecords.filter(
      record => new Date(record.date) >= startOfWeek
    );
    const totalWater = weeklyWater.reduce((sum, record) => sum + record.amount, 0);

    // Calculate exercises
    const weeklyExercises = exerciseRecords.filter(
      record => new Date(record.date) >= startOfWeek
    );

    return {
      fasts: {
        count: weeklyFasts.length,
        records: weeklyFasts
      },
      weight: {
        change: weightChange,
        records: weeklyWeightRecords
      },
      steps: {
        total: totalSteps,
        records: weeklySteps
      },
      water: {
        total: totalWater,
        records: weeklyWater
      },
      exercises: {
        count: weeklyExercises.length,
        records: weeklyExercises
      }
    };
  }, [fastingRecords, weightRecords, stepsRecords, waterRecords, exerciseRecords]);
};
