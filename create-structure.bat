@echo off
echo Creating directory structure...

mkdir src\components 2>nul
mkdir src\utils 2>nul
mkdir src\hooks 2>nul
mkdir src\data 2>nul
mkdir src\constants 2>nul

echo Creating component files...
type nul > src\components\Navigation.jsx
type nul > src\components\TipsWidget.jsx
type nul > src\components\WeeklySummary.jsx
type nul > src\components\AchievementBadge.jsx
type nul > src\components\FastingTab.jsx
type nul > src\components\WeightTab.jsx
type nul > src\components\StepsTab.jsx
type nul > src\components\WaterTab.jsx
type nul > src\components\ExerciseTab.jsx
type nul > src\components\HistoryTab.jsx

echo Creating utils files...
type nul > src\utils\themeUtils.js
type nul > src\utils\dateUtils.js
type nul > src\utils\storageUtils.js
type nul > src\utils\calculationUtils.js

echo Creating hooks files...
type nul > src\hooks\useLocalStorage.js
type nul > src\hooks\useWeeklyData.js

echo Creating data files...
type nul > src\data\achievementStages.js

echo Creating constants files...
type nul > src\constants\tabConfig.js

echo.
echo ✅ All directories and files created successfully!
echo.
dir /s /b src