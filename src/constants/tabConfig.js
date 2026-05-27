import {
  BarChart3,
  Clock,
  Weight,
  Footprints,
  Dumbbell,
  History
} from 'lucide-react';

export const TABS = [
  { id: 'dashboard', label: 'דשבורד 📊', icon: BarChart3 },
  { id: 'fasting', label: 'צום ⏱️', icon: Clock },
  { id: 'weight', label: 'משקל ⚖️', icon: Weight },
  { id: 'steps', label: 'צעדים 👟', icon: Footprints },
  { id: 'water', label: 'מים 💧', icon: null }, // נשאיר את 💧 בתצוגה
  { id: 'exercise', label: 'אימון 🏋️', icon: Dumbbell },
  { id: 'history', label: 'היסטוריה 🗂️', icon: History }
];

export const DEFAULT_TAB = 'dashboard';
