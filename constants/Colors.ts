const tintColorLight = '#0A66C2'; // Professional Blue
const tintColorDark = '#3B82F6';

export const Colors = {
  light: {
    primary: tintColorLight,
    background: '#F3F4F6', // Light gray background
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  dark: {
    primary: tintColorDark,
    background: '#111827', // Dark background
    card: '#1F2937', // Slightly lighter dark for cards
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
};

export default Colors;
