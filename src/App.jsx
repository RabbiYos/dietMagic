import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navigation from './components/Navigation';
import { getWeeklyData } from './utils/weeklyUtils';

// Tabs
import DashboardTab from './components/DashboardTab';
import FastingTab from './components/FastingTab';
import WeightTab from './components/WeightTab';
import StepsTab from './components/StepsTab';
import WaterTab from './components/WaterTab';
import ExerciseTab from './components/ExerciseTab';
import HistoryTab from './components/HistoryTab';
import { DEFAULT_TAB } from './constants/tabConfig';

function App() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  const [fastingRecords, setFastingRecords] = useLocalStorage('fastingRecords', []);
  const [isFasting, setIsFasting] = useLocalStorage('isFasting', false);
  const [fastingStart, setFastingStart] = useLocalStorage('fastingStart', null);

  const [weightRecords, setWeightRecords] = useLocalStorage('weightRecords', []);
  const [height, setHeight] = useLocalStorage('height', '');
  const [targetWeight, setTargetWeight] = useLocalStorage('targetWeight', '');

  const [stepsRecords, setStepsRecords] = useLocalStorage('stepsRecords', []);
  const [waterRecords, setWaterRecords] = useLocalStorage('waterRecords', []);
  const [waterGoal, setWaterGoal] = useLocalStorage('waterGoal', 3600);

  const [exerciseRecords, setExerciseRecords] = useLocalStorage('exerciseRecords', []);
  
  const weeklyData = getWeeklyData({
  fastingRecords,
  weightRecords,
  stepsRecords,
  waterRecords,
  exerciseRecords
});


  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            fastingRecords={fastingRecords}
            weightRecords={weightRecords}
            stepsRecords={stepsRecords}
            waterRecords={waterRecords}
            exerciseRecords={exerciseRecords}
            height={height}
            targetWeight={targetWeight}
            waterGoal={waterGoal}
            weeklyData={weeklyData}
          />
        );

      case 'fasting':
        return (
          <FastingTab
            fastingRecords={fastingRecords}
            setFastingRecords={setFastingRecords}
            isFasting={isFasting}
            setIsFasting={setIsFasting}
            fastingStart={fastingStart}
            setFastingStart={setFastingStart}
          />
        );

      case 'weight':
        return (
          <WeightTab
            weightRecords={weightRecords}
            setWeightRecords={setWeightRecords}
            height={height}
            setHeight={setHeight}
            targetWeight={targetWeight}
            setTargetWeight={setTargetWeight}
          />
        );

      case 'steps':
        return (
          <StepsTab
            stepsRecords={stepsRecords}
            setStepsRecords={setStepsRecords}
          />
        );

      case 'water':
        return (
          <WaterTab
            waterRecords={waterRecords}
            setWaterRecords={setWaterRecords}
            waterGoal={waterGoal}
            setWaterGoal={setWaterGoal}
          />
        );

      case 'exercise':
        return (
          <ExerciseTab
            exerciseRecords={exerciseRecords}
            setExerciseRecords={setExerciseRecords}
          />
        );

      case 'history':
        return (
          <HistoryTab
            fastingRecords={fastingRecords}
            weightRecords={weightRecords}
            stepsRecords={stepsRecords}
            waterRecords={waterRecords}
            exerciseRecords={exerciseRecords}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            The Success Scale
          </h1>
        </div>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
