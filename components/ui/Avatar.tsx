import { Image, ImageProps, Text, View } from 'react-native';

interface AvatarProps extends Omit<ImageProps, 'source'> {
  source?: ImageProps['source'];
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export function Avatar({ source, size = 'md', fallback, className = '', ...props }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
  };

  return source ? (
    <Image source={source} className={`${sizes[size]} rounded-full ${className}`} {...props} />
  ) : (
    <View className={`${sizes[size]} rounded-full bg-gray-300 items-center justify-center ${className}`}>
      <Text className={`${textSizes[size]} font-semibold text-gray-600`}>
        {fallback?.charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}
