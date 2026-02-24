import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input, Button } from '../components/ui';
import { useState } from 'react';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', email, password);
  };

  return (
    <LinearGradient
      colors={['#154EA4', '#3480B5', '#20A0D8', '#48B7E8', '#AEE1F8']}
      className="flex-1 justify-center px-6"
    >
      <View className="items-center mb-8">
        <Text className="text-white text-3xl font-bold">Welcome Back</Text>
        <Text className="text-white/80 text-base mt-2">Sign in to continue</Text>
      </View>

      <View className="bg-white rounded-2xl p-6">
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button variant="primary" onPress={handleLogin} className="mt-4">
          Login
        </Button>
      </View>
    </LinearGradient>
  );
};
