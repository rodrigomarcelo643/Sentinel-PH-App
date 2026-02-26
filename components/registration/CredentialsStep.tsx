import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Input } from '../ui';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

interface CredentialsStepProps {
  fadeAnim: Animated.Value;
  errors: string[];
  contactNumber: string;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  agreedToPolicy: boolean;
  setAgreedToPolicy: (value: boolean) => void;
}

export const CredentialsStep = ({
  fadeAnim,
  errors,
  contactNumber,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  agreedToPolicy,
  setAgreedToPolicy,
}: CredentialsStepProps) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text className="text-xl font-semibold text-[#1B365D] mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
        Account Credentials
      </Text>

      {errors.length > 0 && (
        <View className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
          {errors.map((error, index) => (
            <Text key={index} className="text-red-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      <View className="mb-3">
        <Text className="text-gray-700 text-sm mb-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
          Username <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <View className="flex-row items-center rounded-xl border-2 bg-white px-4 border-gray-300">
          <Text className="mr-2 text-2xl">🇵🇭</Text>
          <Text className="mr-2 font-medium text-base text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>
            +63 
          </Text>
          <View className="mr-2 h-6 w-px bg-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            style={{ paddingVertical: 16, fontFamily: 'Inter-Medium' }}
            value={contactNumber}
            editable={false}
          />
        </View>
      </View>

      <Input
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        icon={<Lock size={20} color="#6b7280" />}
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Eye size={20} color="#6b7280" />
            ) : (
              <EyeOff size={20} color="#6b7280" />
            )}
          </TouchableOpacity>
        }
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword}
        icon={<Lock size={20} color="#6b7280" />}
        rightIcon={
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? (
              <Eye size={20} color="#6b7280" />
            ) : (
              <EyeOff size={20} color="#6b7280" />
            )}
          </TouchableOpacity>
        }
      />
      {confirmPassword.length > 0 && (
        <View style={{ marginTop: -8, marginBottom: 12 }}>
          {passwordsMatch ? (
            <Text style={{ color: '#16a34a', fontFamily: 'Inter-Medium', fontSize: 12 }}>
              ✓ Passwords match
            </Text>
          ) : (
            <Text style={{ color: '#ef4444', fontFamily: 'Inter-Medium', fontSize: 12 }}>
              ✕ Passwords do not match
            </Text>
          )}
        </View>
      )}

      {password.length > 0 && (
        <View className="bg-gray-50 rounded-lg p-3 mb-4">
          <Text className="text-gray-700 text-sm font-semibold mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
            Password Requirements:
          </Text>
          <View style={{ gap: 4 }}>
            <View className="flex-row items-center">
              <Text style={{ color: hasMinLength ? '#16a34a' : '#9ca3af', fontFamily: 'Inter-Medium', fontSize: 14 }}>
                {hasMinLength ? '✓' : '○'} At least 8 characters
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text style={{ color: hasUpperCase ? '#16a34a' : '#9ca3af', fontFamily: 'Inter-Medium', fontSize: 14 }}>
                {hasUpperCase ? '✓' : '○'} One uppercase letter
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text style={{ color: hasLowerCase ? '#16a34a' : '#9ca3af', fontFamily: 'Inter-Medium', fontSize: 14 }}>
                {hasLowerCase ? '✓' : '○'} One lowercase letter
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text style={{ color: hasNumber ? '#16a34a' : '#9ca3af', fontFamily: 'Inter-Medium', fontSize: 14 }}>
                {hasNumber ? '✓' : '○'} One number
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text style={{ color: hasSpecialChar ? '#16a34a' : '#9ca3af', fontFamily: 'Inter-Medium', fontSize: 14 }}>
                {hasSpecialChar ? '✓' : '○'} One special character
              </Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setAgreedToPolicy(!agreedToPolicy)}
        className="flex-row items-start mb-4"
      >
        <View
          className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
            agreedToPolicy ? 'bg-[#1B365D] border-[#1B365D]' : 'border-gray-300'
          }`}
          style={{ marginTop: 2 }}
        >
          {agreedToPolicy && <Text className="text-white text-xs">✓</Text>}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Inter-Medium' }}>
          I agree to the{' '}
          <Text 
            onPress={(e) => {
              e.stopPropagation();
              console.log('Open Terms and Conditions');
            }}
            className="text-[#1B365D] font-semibold" 
            style={{ textDecorationLine: 'underline', fontFamily: 'Inter-SemiBold' }}
          >
            Terms and Conditions
          </Text>
          {' '}and{' '}
          <Text 
            onPress={(e) => {
              e.stopPropagation();
              console.log('Open Privacy Policy');
            }}
            className="text-[#1B365D] font-semibold" 
            style={{ textDecorationLine: 'underline', fontFamily: 'Inter-SemiBold' }}
          >
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
