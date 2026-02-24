import { Text, View, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'info', children, className = '', ...props }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 border-green-500',
    error: 'bg-red-100 border-red-500',
    warning: 'bg-yellow-100 border-yellow-500',
    info: 'bg-blue-100 border-blue-500',
  };
  
  const textColors = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };

  return (
    <View className={`px-2 py-1 rounded-full border ${variants[variant]} ${className}`} {...props}>
      <Text className={`text-xs font-semibold ${textColors[variant]}`}>{children}</Text>
    </View>
  );
}
