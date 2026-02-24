import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';

interface SpinnerProps extends ActivityIndicatorProps {
  size?: 'small' | 'large';
}

export function Spinner({ size = 'small', color = '#2563EB', ...props }: SpinnerProps) {
  return (
    <View className="items-center justify-center">
      <ActivityIndicator size={size} color={color} {...props} />
    </View>
  );
}
