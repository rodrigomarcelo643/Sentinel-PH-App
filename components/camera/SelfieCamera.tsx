import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { X, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface SelfieCameraProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export const SelfieCamera = ({ onCapture, onClose }: SelfieCameraProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-center mb-4" style={{ fontFamily: 'Inter-Medium' }}>
          Camera permission required
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-[#1B365D] px-6 py-3 rounded-lg">
          <Text className="text-white font-medium" style={{ fontFamily: 'Inter-Medium' }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({ quality: 1 });
      onCapture(photo.uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onCapture(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={(ref) => setCamera(ref)}
        style={StyleSheet.absoluteFill}
        facing="front"
      >
        <View className="flex-1">
          <View className="pt-12 px-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="bg-black/50 p-3 rounded-full">
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Take Selfie
            </Text>
            <View style={{ width: 48 }} />
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <View
              style={{
                width: 300,
                height: 300,
                borderWidth: 3,
                borderColor: '#20A0D8',
                borderRadius: 16,
                borderStyle: 'dashed',
              }}
            />
            <Text className="text-white text-center mt-6 text-base" style={{ fontFamily: 'Inter-Medium' }}>
              Position your face within the frame
            </Text>
          </View>

          <View className="pb-12 items-center" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={takePicture}
              className="bg-white w-20 h-20 rounded-full items-center justify-center"
              style={{ 
                borderWidth: 4, 
                borderColor: '#1B365D',
              }}
            >
              <View className="bg-[#1B365D] w-16 h-16 rounded-full" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickFromGallery}
              className="bg-white/90 px-6 py-3 rounded-full flex-row items-center"
              style={{ gap: 8 }}
            >
              <Upload size={20} color="#1B365D" />
              <Text className="text-[#1B365D] font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                Browse Files
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};
