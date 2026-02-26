import { View, Text, TextInput, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '../ui';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { getCurrentLocation } from '../../services';
import { useEffect, useState } from 'react';

interface PersonalDetailsStepProps {
  fadeAnim: Animated.Value;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  middleInitial: string;
  setMiddleInitial: (value: string) => void;
  contactNumber: string;
  handleContactChange: (text: string) => void;
  email: string;
  setEmail: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  municipality: string;
  setMunicipality: (value: string) => void;
  barangay: string;
  setBarangay: (value: string) => void;
  communityRole: string;
  setCommunityRole: (value: string) => void;
  customRole: string;
  setCustomRole: (value: string) => void;
  showRoleDropdown: boolean;
  setShowRoleDropdown: (value: boolean) => void;
  errors: string[];
}

const COMMUNITY_ROLES = [
  'Resident',
  'Sari-Sari Store Owner / Market Vendor',
  'Tricycle Driver / PUV Operator',
  'Barangay Tanod / Leader',
  'Religious Leader / Church Worker',
  'Traditional Healer / Hilot',
  'Barangay Health Worker',
  'Pharmacy Staff',
  'Pharmacy Owner',
  'Other (Specify)',
];

export const PersonalDetailsStep = ({
  fadeAnim,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  middleInitial,
  setMiddleInitial,
  contactNumber,
  handleContactChange,
  email,
  setEmail,
  region,
  setRegion,
  municipality,
  setMunicipality,
  barangay,
  setBarangay,
  communityRole,
  setCommunityRole,
  customRole,
  setCustomRole,
  showRoleDropdown,
  setShowRoleDropdown,
  errors,
}: PersonalDetailsStepProps) => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    handleAutoFillLocation();
  }, []);

  const handleAutoFillLocation = async () => {
    setLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setRegion(location.region);
      setMunicipality(location.municipality);
      setBarangay(location.barangay);
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setLoadingLocation(false);
    }
  };
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text className="text-lg font-semibold text-[#1B365D] mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
        Basic Information
      </Text>
      
      <Input
        label="First Name *"
        placeholder="Enter first name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        error={errors.includes('First Name is required') ? 'First Name is required' : undefined}
      />
      
      <Input
        label="Last Name *"
        placeholder="Enter last name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        error={errors.includes('Last Name is required') ? 'Last Name is required' : undefined}
      />
      
      <Input
        label="Middle Initial (Optional)"
        placeholder="M.I."
        value={middleInitial}
        onChangeText={setMiddleInitial}
        maxLength={2}
        autoCapitalize="characters"
      />

      <View className="mb-3">
        <Text className="text-gray-700 text-sm mb-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
          Community Role <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          className="flex-row items-center justify-between rounded-xl border-2 border-gray-300 bg-white px-4 py-4"
        >
          <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-Medium' }}>
            {communityRole || 'Select your role'}
          </Text>
          <ChevronDown size={20} color="#6b7280" />
        </TouchableOpacity>
        {showRoleDropdown && (
          <View className="mt-2 rounded-xl border-2 border-gray-300 bg-white overflow-hidden">
            {COMMUNITY_ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => {
                  setCommunityRole(role);
                  setShowRoleDropdown(false);
                  if (role !== 'Other (Specify)') {
                    setCustomRole('');
                  }
                }}
                className="px-4 py-3 border-b border-gray-200"
              >
                <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-Medium' }}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {errors.includes('Community Role is required') && (
          <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Inter-Medium' }}>
            Community Role is required
          </Text>
        )}
      </View>

      {communityRole === 'Other (Specify)' && (
        <Input
          label="Specify Role *"
          placeholder="Enter your community role"
          value={customRole}
          onChangeText={setCustomRole}
          autoCapitalize="words"
          error={errors.includes('Custom role is required') ? 'Custom role is required' : undefined}
        />
      )}

      <Text className="text-lg font-semibold text-[#1B365D] mb-4 mt-6" style={{ fontFamily: 'Inter-SemiBold' }}>
        Contact Information
      </Text>

      <View className="mb-3">
        <Text className="text-gray-700 text-sm mb-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
          Contact Number <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <View className={`flex-row items-center rounded-xl border-2 bg-white px-4 ${
          errors.includes('Valid contact number is required') ? 'border-red-500' : 'border-gray-300'
        }`}>
          <Text className="mr-2 text-2xl">🇵🇭</Text>
          <Text className="mr-2 font-medium text-base text-gray-300" style={{ fontFamily: 'Inter-Medium' }}>
            +63 |
          </Text>
          <View className="mr-2 h-6 w-px bg-gray-300" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            style={{ paddingVertical: 16, fontFamily: 'Inter-Medium' }}
            placeholder="9XX XXX XXXX"
            value={contactNumber}
            onChangeText={handleContactChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        {errors.includes('Valid contact number is required') && (
          <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Inter-Medium' }}>
            Valid contact number is required
          </Text>
        )}
      </View>

      <Input
        label="Email Address *"
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.includes('Email is required') ? 'Email is required' : undefined}
      />

      <View className="flex-row items-center justify-between mb-4 mt-6">
        <Text className="text-lg font-semibold text-[#1B365D]" style={{ fontFamily: 'Inter-SemiBold' }}>
          Full Address
        </Text>
        {loadingLocation && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#20A0D8" />
            <Text className="text-[#20A0D8] text-sm ml-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
              Getting location...
            </Text>
          </View>
        )}
      </View>

      <Input
        label="Region *"
        placeholder="Enter region"
        value={region}
        onChangeText={setRegion}
        autoCapitalize="words"
      />

      <Input
        label="Municipality *"
        placeholder="Enter municipality"
        value={municipality}
        onChangeText={setMunicipality}
        autoCapitalize="words"
      />

      <Input
        label="Barangay *"
        placeholder="Enter barangay"
        value={barangay}
        onChangeText={setBarangay}
        autoCapitalize="words"
      />
    </Animated.View>
  );
};
