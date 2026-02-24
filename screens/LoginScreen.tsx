import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Input, Button } from '../components/ui';
import { useState } from 'react';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', email, password);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <View className="items-center mb-4">
        <Image 
          source={require('../assets/logo/logo.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ marginBottom: -20 }}>
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
        <Button variant="primary" size="lg" onPress={handleLogin} className="mt-4">
          Login
        </Button>
        <TouchableOpacity onPress={handleForgotPassword} className="items-center mt-4">
          <Text className="text-blue-600 text-lg font-semibold" style={{ textDecorationLine: 'underline' }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
