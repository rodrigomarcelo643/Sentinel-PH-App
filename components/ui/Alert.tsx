import { Text, View, ViewProps } from 'react-native';

interface AlertProps extends ViewProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'info', title, children, className = '', ...props }: AlertProps) {
  const variants = {
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-blue-50 border-blue-500',
  };
  
  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <View className={`p-4 rounded-lg border-l-4 ${variants[variant]} ${className}`} {...props}>
      {title && <Text className={`font-semibold mb-1 ${textColors[variant]}`}>{title}</Text>}
      <Text className={textColors[variant]}>{children}</Text>
    </View>
  );
}
