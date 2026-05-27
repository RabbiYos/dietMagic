import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import AuthScreen from './components/AuthScreen';
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
  const { user, loading } = useAuth();

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

  // Loading spinner
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Not logged in → show auth screen
  if (!user) return <AuthScreen />;

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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <main className="pb-20">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;