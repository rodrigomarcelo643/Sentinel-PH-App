import { View, Text, TouchableOpacity, Platform, ActivityIndicator, Animated, Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft } from 'lucide-react-native';
import { ReportTypeStep, SymptomsStep, DetailsStep, ProofCamera } from '../components/report';
import { useAuth } from '../context';
import { uploadToCloudinary } from '../services';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import * as Location from 'expo-location';

interface ReportScreenProps {
  onBack: () => void;
}

export const ReportScreen = ({ onBack }: ReportScreenProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Form data
  const [reportType, setReportType] = useState<'self' | 'observed' | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [barangay, setBarangay] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [showProofCamera, setShowProofCamera] = useState(false);

  const totalSteps = 3;

  const handleToggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return reportType !== null;
      case 2: return symptoms.length > 0 || customSymptom.trim() !== '';
      case 3: return description.trim() !== '';
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let proofImageUrl = '';
      if (proofImage) {
        proofImageUrl = await uploadToCloudinary(proofImage);
      }

      const loc = await Location.getCurrentPositionAsync({});

      await addDoc(collection(db, 'symptomReports'), {
        userId: user?.uid,
        userName: `${user?.firstName} ${user?.lastName}`,
        reportType,
        symptoms,
        customSymptom,
        description,
        location,
        barangay,
        proofImageUrl,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      alert('Report submitted successfully!');
      onBack();
    } catch (error) {
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ReportTypeStep reportType={reportType} onSelect={setReportType} />;
      case 2:
        return (
          <SymptomsStep
            symptoms={symptoms}
            customSymptom={customSymptom}
            onToggleSymptom={handleToggleSymptom}
            onCustomSymptomChange={setCustomSymptom}
          />
        );
      case 3:
        return (
          <DetailsStep
            description={description}
            location={location}
            barangay={barangay}
            proofImage={proofImage}
            onDescriptionChange={setDescription}
            onLocationChange={(loc, brgy) => {
              setLocation(loc);
              setBarangay(brgy);
            }}
            onImageSelect={setProofImage}
            onOpenCamera={() => setShowProofCamera(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: 'white',
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {/* Header */}
      <View style={{ backgroundColor: '#1B365D', paddingTop: Platform.OS === 'ios' ? 60 : 45, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
            {currentStep === 1 ? (
              <X size={24} color="white" strokeWidth={2} />
            ) : (
              <ChevronLeft size={24} color="white" strokeWidth={2} />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'Inter-SemiBold' }}>
            Report Symptoms
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Step Indicator */}
        <View style={{ flexDirection: 'row', marginTop: 20, gap: 8 }}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: step <= currentStep ? '#20A0D8' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {renderStep()}
      </View>

      {/* Footer */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed() || loading}
          style={{
            backgroundColor: canProceed() && !loading ? '#1B365D' : '#E5E7EB',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '600', color: canProceed() ? 'white' : '#9CA3AF', fontFamily: 'Inter-SemiBold' }}>
              {currentStep === totalSteps ? 'Submit Report' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Proof Camera Modal */}
      <Modal visible={showProofCamera} animationType="slide" presentationStyle="fullScreen">
        <ProofCamera
          onCapture={(uri) => {
            setProofImage(uri);
            setShowProofCamera(false);
          }}
          onClose={() => setShowProofCamera(false)}
        />
      </Modal>
    </Animated.View>
  );
};
