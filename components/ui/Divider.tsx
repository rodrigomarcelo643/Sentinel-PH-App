import { View, ViewProps } from 'react-native';

interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ orientation = 'horizontal', className = '', ...props }: DividerProps) {
  return (
    <View 
      className={`bg-gray-200 ${
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'
      } ${className}`}
      {...props}
    />
  );
}
