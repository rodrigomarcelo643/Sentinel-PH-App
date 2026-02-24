import { Switch as RNSwitch, SwitchProps, Text, View } from 'react-native';

interface CustomSwitchProps extends SwitchProps {
  label?: string;
}

export function Switch({ label, ...props }: CustomSwitchProps) {
  return (
    <View className="flex-row items-center justify-between">
      {label && <Text className="text-gray-700">{label}</Text>}
      <RNSwitch
        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
        thumbColor={props.value ? '#2563EB' : '#F3F4F6'}
        {...props}
      />
    </View>
  );
}
