import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { ScanLine, Camera, ChevronDown, X } from 'lucide-react-native';

interface DocumentVerificationStepProps {
  fadeAnim: Animated.Value;
  errors: string[];
  idType: string;
  setIdType: (value: string) => void;
  showIdDropdown: boolean;
  setShowIdDropdown: (value: boolean) => void;
  validId: string | null;
  setValidId: (value: string | null) => void;
  selfie: string | null;
  setSelfie: (value: string | null) => void;
  setShowIdScanner: (value: boolean) => void;
  setShowSelfieCamera: (value: boolean) => void;
  idImageLoading: boolean;
  setIdImageLoading: (value: boolean) => void;
  selfieImageLoading: boolean;
  setSelfieImageLoading: (value: boolean) => void;
}

const ID_TYPES = ['Driver\'s License', 'Passport', 'National ID', 'Voter\'s ID', 'SSS ID', 'UMID'];

export const DocumentVerificationStep = ({
  fadeAnim,
  errors,
  idType,
  setIdType,
  showIdDropdown,
  setShowIdDropdown,
  validId,
  setValidId,
  selfie,
  setSelfie,
  setShowIdScanner,
  setShowSelfieCamera,
  idImageLoading,
  setIdImageLoading,
  selfieImageLoading,
  setSelfieImageLoading,
}: DocumentVerificationStepProps) => {
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text className="text-xl font-semibold text-[#1B365D] mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
        Document Verification
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

      <View className="mb-4">
        <Text className="text-gray-700 text-sm mb-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
          Select ID Type <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowIdDropdown(!showIdDropdown)}
          className="flex-row items-center justify-between rounded-xl border-2 border-gray-300 bg-white px-4 py-4"
        >
          <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-Medium' }}>
            {idType || 'Select ID Type'}
          </Text>
          <ChevronDown size={20} color="#6b7280" />
        </TouchableOpacity>
        {showIdDropdown && (
          <View className="mt-2 rounded-xl border-2 border-gray-300 bg-white overflow-hidden">
            {ID_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setIdType(type);
                  setShowIdDropdown(false);
                }}
                className="px-4 py-3 border-b border-gray-200"
              >
                <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-Medium' }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-700 text-sm font-medium" style={{ fontFamily: 'Inter-Medium' }}>
            Valid ID <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          {validId && (
            <TouchableOpacity
              onPress={() => setValidId(null)}
              style={{ backgroundColor: '#ef4444', borderRadius: 9999, padding: 12 }}
            >
              <X size={16} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowIdScanner(true)}
          style={{
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: errors.includes('Valid ID is required') ? '#f87171' : '#9ca3af',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {validId ? (
            <View>
              {idImageLoading && (
                <View className="absolute inset-0 bg-gray-200 items-center justify-center" style={{ height: 192 }}>
                  <View className="w-12 h-12 border-4 border-gray-300 border-t-[#1B365D] rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                </View>
              )}
              <Image 
                source={{ uri: validId }} 
                style={{ width: '100%', height: 192 }} 
                resizeMode="cover"
                onLoadStart={() => setIdImageLoading(true)} 
                onLoadEnd={() => setIdImageLoading(false)}
              />
            </View>
          ) : (
            <View className="p-8 items-center bg-white">
              <ScanLine size={48} color="#1B365D" strokeWidth={1.5} />
              <Text className="text-[#1B365D] font-semibold text-base mt-4" style={{ fontFamily: 'Inter-SemiBold' }}>
                Scan your ID
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-700 text-sm font-medium" style={{ fontFamily: 'Inter-Medium' }}>
            Selfie <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          {selfie && (
            <TouchableOpacity
              onPress={() => setSelfie(null)}
              style={{ backgroundColor: '#ef4444', borderRadius: 9999, padding: 12 }}
            >
              <X size={16} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowSelfieCamera(true)}
          style={{
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: errors.includes('Selfie is required') ? '#f87171' : '#9ca3af',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {selfie ? (
            <View>
              {selfieImageLoading && (
                <View className="absolute inset-0 bg-gray-200 items-center justify-center" style={{ height: 192 }}>
                  <View className="w-12 h-12 border-4 border-gray-300 border-t-[#1B365D] rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                </View>
              )}
              <Image 
                source={{ uri: selfie }} 
                style={{ width: '100%', height: 192 }} 
                resizeMode="cover"
                onLoadStart={() => setSelfieImageLoading(true)} 
                onLoadEnd={() => setSelfieImageLoading(false)}
              />
            </View>
          ) : (
            <View className="p-8 items-center bg-white">
              <Camera size={48} color="#1B365D" strokeWidth={1.5} />
              <Text className="text-[#1B365D] font-semibold text-base mt-4" style={{ fontFamily: 'Inter-SemiBold' }}>
                Take a picture
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
