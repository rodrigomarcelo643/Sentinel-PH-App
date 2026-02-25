import { View, Image, ActivityIndicator } from 'react-native';

export const SplashScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="items-center">
        <Image
          source={require('../../assets/logo/logo.png')}
          className="h-[200px] w-[200px] "
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#1B365D" className="-mt-10" />
      </View>
    </View>
  );
};
