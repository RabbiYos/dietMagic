export const getFastingStage = (hours) => {
  if (hours < 2) return { 
    title: 'עליית סוכר', 
    description: 'הגוף מעכל את הארוחה האחרונה, רמות הסוכר והאינסולין עולות.', 
    icon: '🍽️', 
    color: 'bg-blue-50 border-blue-200' 
  };
  if (hours < 4) return { 
    title: 'ירידת סוכר', 
    description: 'רמות הסוכר מתחילות לרדת, הגוף מסיים את העיכול הראשוני.', 
    icon: '📉', 
    color: 'bg-blue-100 border-blue-300' 
  };
  if (hours < 8) return { 
    title: 'איזון מחדש', 
    description: 'האינסולין יורד לנורמה. הגוף מפסיק לאגור שומן ומתכונן לשריפה.', 
    icon: '⚖️', 
    color: 'bg-indigo-50 border-indigo-200' 
  };
  if (hours < 12) return { 
    title: 'מצב צום', 
    description: 'מערכת העיכול במנוחה מלאה. הגוף עובר להשתמש במאגרי אנרגיה זמינים.', 
    icon: '🌙', 
    color: 'bg-purple-50 border-purple-200' 
  };
  if (hours < 16) return { 
    title: 'שריפת שומן', 
    description: 'השלב הקלאסי (16:8). הגוף מתחיל לפרק שומן לאנרגיה בצורה יעילה.', 
    icon: '🔥', 
    color: 'bg-orange-50 border-orange-200' 
  };
  if (hours < 24) return { 
    title: 'אוטופגיה (ניקוי)', 
    description: 'התאים מתחילים תהליך של ניקוי עצמי, מחזור פסולת ותיקון פגמים.', 
    icon: '♻️', 
    color: 'bg-green-50 border-green-200' 
  };
  if (hours < 48) return { 
    title: 'הורמון גדילה', 
    description: 'זינוק בהורמון הגדילה (HGH) המסייע לשימור שריר ולשריפת שומן מואצת.', 
    icon: '💪', 
    color: 'bg-red-50 border-red-200' 
  };
  return { 
    title: 'התחדשות עמוקה', 
    description: 'ירידה משמעותית בדלקתיות והתחדשות של מערכת החיסון.', 
    icon: '🛡️', 
    color: 'bg-yellow-50 border-yellow-200' 
  };
};

// הערכה גסה של BMR בזמן מנוחה (כ-70 קלוריות לשעה לאדם ממוצע)
export const calculateBurnedCalories = (hours) => {
  return Math.floor(hours * 72); 
};
