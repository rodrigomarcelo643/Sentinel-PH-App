import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';

interface SymptomsStepProps {
  symptoms: string[];
  customSymptom: string;
  onToggleSymptom: (symptom: string) => void;
  onCustomSymptomChange: (text: string) => void;
}

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Headache',
  'Sore Throat',
  'Fatigue',
  'Body Aches',
  'Runny Nose',
  'Difficulty Breathing',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Loss of Taste/Smell',
  'Rash',
  'Chills',
  'Chest Pain',
  'Abdominal Pain',
  'Dizziness',
  'Joint Pain',
];

export const SymptomsStep = ({ symptoms, customSymptom, onToggleSymptom, onCustomSymptomChange }: SymptomsStepProps) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
          Symptoms
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, fontFamily: 'Inter-Medium' }}>
          Select all symptoms that apply
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {COMMON_SYMPTOMS.map((symptom) => {
            const isSelected = symptoms.includes(symptom);
            return (
              <TouchableOpacity
                key={symptom}
                onPress={() => onToggleSymptom(symptom)}
                style={{
                  backgroundColor: isSelected ? '#1B365D' : 'white',
                  borderWidth: 2,
                  borderColor: isSelected ? '#1B365D' : '#E5E7EB',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isSelected && <Check size={16} color="white" strokeWidth={2.5} />}
                <Text style={{ fontSize: 14, color: isSelected ? 'white' : '#6B7280', fontWeight: isSelected ? '600' : '500', fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Medium' }}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
            Other Symptoms (if not listed above)
          </Text>
          <TextInput
            value={customSymptom}
            onChangeText={onCustomSymptomChange}
            placeholder="Describe any other symptoms not listed above..."
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              color: '#1F2937',
              fontFamily: 'Inter-Medium',
              textAlignVertical: 'top',
              backgroundColor: 'white',
              minHeight: 100,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
