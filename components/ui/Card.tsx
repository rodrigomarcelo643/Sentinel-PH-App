import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  children: React.ReactNode;
}

export function Card({ variant = 'default', children, className = '', ...props }: CardProps) {
  const baseStyles = 'bg-white rounded-xl p-4';
  
  const variantStyles = {
    default: 'border border-gray-200',
    elevated: 'shadow-lg shadow-black/10',
  };

  return (
    <View className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </View>
  );
}
