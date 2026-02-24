import { Text, TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, label, disabled }: CheckboxProps) {
  return (
    <TouchableOpacity 
      className="flex-row items-center"
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
    >
      <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
      } ${disabled ? 'opacity-50' : ''}`}>
        {checked && <Text className="text-white text-xs">✓</Text>}
      </View>
      {label && <Text className={`ml-2 text-gray-700 ${disabled ? 'opacity-50' : ''}`}>{label}</Text>}
    </TouchableOpacity>
  );
}
