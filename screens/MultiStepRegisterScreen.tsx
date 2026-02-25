import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Button } from '../components/ui';
import { StepIndicator } from '../components/ui/StepIndicator';
import { useState, useEffect, useRef } from 'react';
import { PersonalDetailsStep, DocumentVerificationStep, CredentialsStep, RegistrationModals } from '../components/registration';

interface MultiStepRegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const MultiStepRegisterScreen = ({ onNavigateToLogin }: MultiStepRegisterScreenProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [errors, setErrors] = useState<string[]>([]);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [barangay, setBarangay] = useState('');

  // Step 2: Document Validation
  const [idType, setIdType] = useState('');
  const [showIdDropdown, setShowIdDropdown] = useState(false);
  const [validId, setValidId] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [showIdScanner, setShowIdScanner] = useState(false);
  const [showSelfieCamera, setShowSelfieCamera] = useState(false);
  const [idImageLoading, setIdImageLoading] = useState(false);
  const [selfieImageLoading, setSelfieImageLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 3: Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isStep3Valid = password && confirmPassword && password === confirmPassword && 
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && agreedToPolicy;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Set username to contact number when moving to step 3
    if (currentStep === 3 && contactNumber && !username) {
      setUsername(`+63${contactNumber}`);
    }
  }, [currentStep]);

  const handleContactChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      setContactNumber(cleaned.substring(1));
    } else if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };



  const handleNext = () => {
    const newErrors: string[] = [];
    
    if (currentStep === 1) {
      if (!firstName) newErrors.push('First Name is required');
      if (!lastName) newErrors.push('Last Name is required');
      if (contactNumber.length !== 10) newErrors.push('Valid contact number is required');
      if (!email) newErrors.push('Email is required');
    } else if (currentStep === 2) {
      if (!idType) newErrors.push('ID Type is required');
      if (!validId) newErrors.push('Valid ID is required');
      if (!selfie) newErrors.push('Selfie is required');
    }
    
    setErrors(newErrors);
    if (newErrors.length > 0) return;
    
    fadeAnim.setValue(0);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setErrors([]);
    fadeAnim.setValue(0);
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    const newErrors: string[] = [];
    
    if (!username) newErrors.push('Username is required');
    if (!password) newErrors.push('Password is required');
    if (!confirmPassword) newErrors.push('Confirm Password is required');
    if (password !== confirmPassword) newErrors.push('Passwords do not match');
    if (!agreedToPolicy) newErrors.push('You must agree to the terms and policy');
    
    setErrors(newErrors);
    if (newErrors.length > 0) return;
    
    setIsRegistering(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsRegistering(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            fadeAnim={fadeAnim}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            middleInitial={middleInitial}
            setMiddleInitial={setMiddleInitial}
            contactNumber={contactNumber}
            handleContactChange={handleContactChange}
            email={email}
            setEmail={setEmail}
            region={region}
            setRegion={setRegion}
            municipality={municipality}
            setMunicipality={setMunicipality}
            barangay={barangay}
            setBarangay={setBarangay}
            errors={errors}
          />
        );

      case 2:
        return (
          <DocumentVerificationStep
            fadeAnim={fadeAnim}
            errors={errors}
            idType={idType}
            setIdType={setIdType}
            showIdDropdown={showIdDropdown}
            setShowIdDropdown={setShowIdDropdown}
            validId={validId}
            setValidId={setValidId}
            selfie={selfie}
            setSelfie={setSelfie}
            setShowIdScanner={setShowIdScanner}
            setShowSelfieCamera={setShowSelfieCamera}
            idImageLoading={idImageLoading}
            setIdImageLoading={setIdImageLoading}
            selfieImageLoading={selfieImageLoading}
            setSelfieImageLoading={setSelfieImageLoading}
          />
        );

      case 3:
        return (
          <CredentialsStep
            fadeAnim={fadeAnim}
            errors={errors}
            contactNumber={contactNumber}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            agreedToPolicy={agreedToPolicy}
            setAgreedToPolicy={setAgreedToPolicy}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 48 }}>
        <Text className="text-2xl font-semibold text-[#1B365D] mb-2 text-center" style={{ fontFamily: 'Inter-SemiBold' }}>
          Create Account
        </Text>

        <View className="items-center">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            steps={['Personal', 'Verification', 'Credentials']}
          />
        </View>

        {renderStep()}

        <View className="flex-row mt-6" style={{ gap: 12 }}>
          {currentStep > 1 ? (
            <>
              <Button variant="outline" size="lg" onPress={handleBack} style={{ flex: 1 }}>
                Prev
              </Button>
              {currentStep < 3 ? (
                <Button variant="primary" size="lg" onPress={handleNext} style={{ flex: 1 }}>
                  Next
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  onPress={handleRegister} 
                  style={{ flex: 1, opacity: isStep3Valid ? 1 : 0.5 }}
                  disabled={!isStep3Valid}
                >
                  Register
                </Button>
              )}
            </>
          ) : (
            <Button variant="primary" size="lg" onPress={handleNext} style={{ flex: 1 }}>
              Next
            </Button>
          )}
        </View>

        <View className="mt-4 flex-row items-center justify-center" style={{ marginTop: 10 }}>
          <Text className="text-lg text-gray-600" style={{ fontFamily: 'Inter-Medium' }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text className="font-semibold text-lg text-[#1B365D]" style={{ textDecorationLine: 'underline' }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RegistrationModals
        showIdScanner={showIdScanner}
        setShowIdScanner={setShowIdScanner}
        setValidId={setValidId}
        showSelfieCamera={showSelfieCamera}
        setShowSelfieCamera={setShowSelfieCamera}
        setSelfie={setSelfie}
        isRegistering={isRegistering}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        onNavigateToLogin={onNavigateToLogin}
      />
    </View>
  );
};
