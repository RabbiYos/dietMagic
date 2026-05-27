export const getThemeColor = (tab) => {
  switch (tab) {
    case 'fasting':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
    case 'weight':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      };
    case 'water':
      return {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-800',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
      };
    case 'steps':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    case 'exercise':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600'
      };
  }
};
