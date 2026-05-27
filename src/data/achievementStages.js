export const achievementStages = [
  { 
    id: 1, 
    name: 'מתחיל', 
    minFasts: 0, 
    icon: '🌱',
    description: 'התחלת את המסע! כל צום ראשון הוא הישג.'
  },
  { 
    id: 2, 
    name: 'מתמיד', 
    minFasts: 5, 
    icon: '🔥',
    description: '5 צומות הושלמו - אתה בדרך הנכונה!'
  },
  { 
    id: 3, 
    name: 'מחויב', 
    minFasts: 10, 
    icon: '💪',
    description: '10 צומות! זה הופך להרגל חזק.'
  },
  { 
    id: 4, 
    name: 'מנוסה', 
    minFasts: 20, 
    icon: '⭐',
    description: '20 צומות - אתה כבר מקצוען!'
  },
  { 
    id: 5, 
    name: 'מאסטר', 
    minFasts: 50, 
    icon: '🏆',
    description: '50 צומות! אתה מאסטר אמיתי!'
  },
  { 
    id: 6, 
    name: 'אגדה', 
    minFasts: 100, 
    icon: '👑',
    description: '100 צומות - אתה אגדה חיה!'
  }
];

export const getCurrentStage = (fastCount) => {
  let currentStage = achievementStages[0];
  
  for (let i = achievementStages.length - 1; i >= 0; i--) {
    if (fastCount >= achievementStages[i].minFasts) {
      currentStage = achievementStages[i];
      break;
    }
  }
  
  return currentStage;
};

export const getNextStage = (fastCount) => {
  const currentStageIndex = achievementStages.findIndex(
    stage => fastCount < stage.minFasts
  );
  
  if (currentStageIndex === -1) {
    return null; // Already at max stage
  }
  
  return achievementStages[currentStageIndex];
};

export const getProgressToNextStage = (fastCount) => {
  const nextStage = getNextStage(fastCount);
  
  if (!nextStage) {
    return 100; // Max stage reached
  }
  
  const currentStage = getCurrentStage(fastCount);
  const fastsInCurrentStage = fastCount - currentStage.minFasts;
  const fastsNeededForNextStage = nextStage.minFasts - currentStage.minFasts;
  
  return Math.round((fastsInCurrentStage / fastsNeededForNextStage) * 100);
};
