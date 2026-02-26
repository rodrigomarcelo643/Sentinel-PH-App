import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, ActivityIndicator, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, AlertCircle, TrendingUp, Zap, Activity, Eye } from 'lucide-react-native';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'disclaimer';
  content: string;
  confidence?: number;
  diseases?: Array<{ name: string; confidence: number; severity: string }>;
}

interface AiDoctorAssistantScreenProps {
  onBack: () => void;
}

export const AiDoctorAssistantScreen = ({ onBack }: AiDoctorAssistantScreenProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'disclaimer',
      content: 'disclaimer'
    },
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Guide. I can help you understand your symptom patterns and provide general health information. Think of me as a helpful guide, not a medical professional. How can I assist you today?'
    }
  ]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showFrequencyChart, setShowFrequencyChart] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSymptoms, setRecentSymptoms] = useState<string[]>([]);
  const [observedSymptoms, setObservedSymptoms] = useState<string[]>([]);
  const [symptomFrequency, setSymptomFrequency] = useState<Record<string, number>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    fetchRecentSymptoms();
  }, []);

  const fetchRecentSymptoms = async () => {
    try {
      const q = query(
        collection(db, 'symptomReports'),
        where('userId', '==', user?.uid)
      );
      const snapshot = await getDocs(q);
      const selfSymptoms: string[] = [];
      const observedSymptomsData: string[] = [];
      const frequencyMap: Record<string, number> = {};
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const reports = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter((data: any) => {
          const createdAt = data.createdAt?.toDate?.() || new Date(0);
          return createdAt >= oneWeekAgo;
        })
        .sort((a: any, b: any) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });
      
      reports.forEach((data: any) => {
        const symptoms = [...(data.symptoms || []), data.customSymptom].filter(Boolean);
        symptoms.forEach(symptom => {
          frequencyMap[symptom] = (frequencyMap[symptom] || 0) + 1;
        });
        
        if (data.reportType === 'self') {
          selfSymptoms.push(...symptoms);
        } else if (data.reportType === 'observed') {
          observedSymptomsData.push(...symptoms);
        }
      });
      
      setRecentSymptoms([...new Set(selfSymptoms)]);
      setObservedSymptoms([...new Set(observedSymptomsData)]);
      setSymptomFrequency(frequencyMap);
    } catch (error) {
      console.error('Failed to fetch symptoms:', error);
    }
  };

  const sendMessage = async (autoMessage?: string) => {
    const messageToSend = autoMessage || input.trim();
    if (!messageToSend || loading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!autoMessage) setInput('');
    setLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      if (!apiKey || apiKey.includes('your_') || apiKey.length < 20) {
        throw new Error('API key not configured. Please check your .env file and restart the server with: pnpm start --clear');
      }

      const frequencyContext = Object.entries(symptomFrequency)
        .map(([symptom, count]) => `${symptom} (reported ${count}x)`)
        .join(', ');
      
      const context = recentSymptoms.length > 0 
        ? `User's self-reported symptoms from the past week with frequency: ${frequencyContext}. ` 
        : '';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a health information guide assistant. ${context}When analyzing symptoms, provide possible diseases with realistic confidence percentages (50-85%) and severity levels. Format each disease EXACTLY as: "DISEASE: [Disease Name] | CONFIDENCE: [X]% | SEVERITY: [Low/Medium/High/Critical]". Provide 2-4 most likely conditions. Provide brief, helpful guidance (max 200 words). Remember to mention you're a guide to help users understand their symptoms, not a medical professional. Encourage consulting healthcare providers for proper diagnosis.`
            },
            { role: 'user', content: messageToSend }
          ],
          max_tokens: 250,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('OpenAI API Error:', data.error);
        throw new Error(data.error.message || 'API request failed');
      }

      if (!data.choices || !data.choices[0]) {
        console.error('Invalid API response:', data);
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.choices[0].message.content;
      
      // Parse diseases with progress bars
      const diseaseRegex = /DISEASE:\s*([^|]+)\s*\|\s*CONFIDENCE:\s*(\d+)%\s*\|\s*SEVERITY:\s*(\w+)/gi;
      const diseaseMatches = [...aiResponse.matchAll(diseaseRegex)];
      const diseases = diseaseMatches.map((match) => ({
        name: (match[1] || '').trim(),
        confidence: parseInt(match[2] || '0'),
        severity: (match[3] || '').trim()
      }));
      
      const cleanContent = aiResponse.replace(/DISEASE:[^\n]+/gi, '').trim();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: cleanContent,
        diseases: diseases.length > 0 ? diseases : undefined
      }]);
    } catch (error: any) {
      console.error('AI Request Error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      let errorMessage = '⚠️ Unable to process your request. ';
      
      if (error.message?.includes('API key') || error.message?.includes('invalid_api_key')) {
        errorMessage += 'Invalid API key. Please restart the server with: pnpm start --clear';
        console.error('API Key Error: Invalid or expired OpenAI API key');
        console.error('Solution: 1) Stop server 2) Run: pnpm start --clear 3) Reload app');
      } else if (error.message?.includes('not configured')) {
        errorMessage += error.message;
        console.error('Configuration Error:', error.message);
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage += 'Network connection issue.';
        console.error('Network Error: Check internet connection');
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorMessage += 'Service temporarily unavailable.';
        console.error('Rate Limit Error: OpenAI quota exceeded');
      } else {
        errorMessage += 'Please try again.';
        console.error('Unknown Error:', error.message);
      }
      
      errorMessage += ' Consult a healthcare professional for medical advice.';
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        confidence: 0
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return '#10B981';
    if (confidence >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Custom Header */}
        <View style={{ 
          backgroundColor: '#1B365D', 
          paddingTop: Platform.OS === 'ios' ? 60 : 45,
          paddingBottom: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12
        }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
            <ArrowLeft size={24} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/ai_doctor_icon.png')}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Inter-SemiBold' }}>
              AI Health Guide
            </Text>
            <Text style={{ color: '#93C5FD', fontSize: 12, fontFamily: 'Inter-Medium' }}>
              Your health information guide
            </Text>
          </View>
        </View>

        {/* Disclaimer Banner */}
        {showDisclaimer && (
          <View style={{
            backgroundColor: '#FEF3C7',
            borderBottomWidth: 3,
            borderBottomColor: '#F59E0B',
            padding: 16
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="#D97706" style={{ marginTop: 2, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#92400E', fontFamily: 'Inter-SemiBold', fontSize: 13, marginBottom: 6 }}>
                  ⚠️ Health Information Guide
                </Text>
                <Text style={{ color: '#92400E', fontFamily: 'Inter-Medium', fontSize: 11, lineHeight: 16 }}>
                  This AI is a health information guide to help you understand symptoms. It cannot diagnose or treat conditions. Always consult a licensed healthcare provider for medical advice and treatment.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowDisclaimer(false)} style={{ padding: 4 }}>
                <Text style={{ color: '#D97706', fontFamily: 'Inter-SemiBold', fontSize: 18 }}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {messages.length === 2 && (recentSymptoms.length > 0 || observedSymptoms.length > 0) && (
          <View style={{ padding: 16, paddingBottom: 8 }}>
            <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Inter-SemiBold', marginBottom: 10 }}>
              QUICK ANALYSIS
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {recentSymptoms.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    const frequencyList = Object.entries(symptomFrequency)
                      .filter(([symptom]) => recentSymptoms.includes(symptom))
                      .map(([symptom, count]) => `${symptom} (${count}x)`)
                      .join(', ');
                    const message = `Analyze my self-reported symptoms with their frequency and provide possible diseases with confidence percentages: ${frequencyList}`;
                    sendMessage(message);
                  }}
                  style={{
                    backgroundColor: '#EEF2FF',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: '#C7D2FE'
                  }}
                >
                  <Activity size={14} color="#4F46E5" />
                  <Text style={{ color: '#4F46E5', fontSize: 12, fontFamily: 'Inter-SemiBold' }}>
                    My Symptoms ({recentSymptoms.length})
                  </Text>
                </TouchableOpacity>
              )}
              {observedSymptoms.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    const frequencyList = Object.entries(symptomFrequency)
                      .filter(([symptom]) => observedSymptoms.includes(symptom))
                      .map(([symptom, count]) => `${symptom} (${count}x)`)
                      .join(', ');
                    const message = `Analyze these observed symptoms with their frequency and provide possible diseases with confidence percentages: ${frequencyList}`;
                    sendMessage(message);
                  }}
                  style={{
                    backgroundColor: '#FEF3C7',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: '#FDE68A'
                  }}
                >
                  <Eye size={14} color="#D97706" />
                  <Text style={{ color: '#D97706', fontSize: 12, fontFamily: 'Inter-SemiBold' }}>
                    Observed ({observedSymptoms.length})
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setInput('What should I do if symptoms worsen?')}
                style={{
                  backgroundColor: '#DBEAFE',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderWidth: 1,
                  borderColor: '#BFDBFE'
                }}
              >
                <Zap size={14} color="#1D4ED8" />
                <Text style={{ color: '#1D4ED8', fontSize: 12, fontFamily: 'Inter-SemiBold' }}>
                  When to See Doctor?
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        >
          {messages.filter(m => m.role !== 'disclaimer').map((msg, idx) => (
            <Animated.View
              key={idx}
              style={{
                marginBottom: 12,
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              {msg.role === 'user' ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ 
                    backgroundColor: '#1B365D',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderBottomRightRadius: 4,
                    maxWidth: '80%'
                  }}>
                    <Text style={{ 
                      color: 'white', 
                      fontSize: 14, 
                      fontFamily: 'Inter-Medium',
                      lineHeight: 20
                    }}>
                      {msg.content}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                    <Image
                      source={require('../assets/images/ai_doctor_icon.png')}
                      style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                      resizeMode="cover"
                    />
                    <View style={{ 
                      backgroundColor: 'white',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      borderBottomLeftRadius: 4,
                      maxWidth: '80%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ 
                          color: '#20A0D8', 
                          fontSize: 12, 
                          fontFamily: 'Inter-SemiBold'
                        }}>
                          AI Health Guide
                        </Text>
                      </View>
                      <Text style={{ 
                        color: '#374151', 
                        fontSize: 14, 
                        fontFamily: 'Inter-Medium',
                        lineHeight: 20
                      }}>
                        {msg.content.replace(/\d+\./g, '•')}
                      </Text>
                      
                      {/* Disease Progress Bars */}
                      {msg.diseases && msg.diseases.length > 0 && (
                        <View style={{ marginTop: 12 }}>
                          {/* Disease List */}
                          {msg.diseases.map((disease, dIdx) => {
                            const severityColor = 
                              disease.severity.toLowerCase() === 'critical' ? '#DC2626' :
                              disease.severity.toLowerCase() === 'high' ? '#F59E0B' :
                              disease.severity.toLowerCase() === 'medium' ? '#3B82F6' : '#10B981';
                            
                            return (
                              <View key={dIdx} style={{ marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: '#1F2937' }}>
                                    {disease.name}
                                  </Text>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <View style={{
                                      backgroundColor: severityColor + '20',
                                      paddingHorizontal: 6,
                                      paddingVertical: 2,
                                      borderRadius: 4
                                    }}>
                                      <Text style={{ fontSize: 9, fontFamily: 'Inter-SemiBold', color: severityColor }}>
                                        {disease.severity.toUpperCase()}
                                      </Text>
                                    </View>
                                    <Text style={{ fontSize: 11, fontFamily: 'Inter-SemiBold', color: '#6B7280' }}>
                                      {disease.confidence}%
                                    </Text>
                                  </View>
                                </View>
                                <View style={{ 
                                  height: 6, 
                                  backgroundColor: '#E5E7EB', 
                                  borderRadius: 3,
                                  overflow: 'hidden'
                                }}>
                                  <View style={{ 
                                    height: '100%', 
                                    width: `${disease.confidence}%`,
                                    backgroundColor: severityColor,
                                    borderRadius: 3
                                  }} />
                                </View>
                              </View>
                            );
                          })}
                          
                          {/* Symptom Frequency Chart */}
                          {Object.keys(symptomFrequency).length > 0 && showFrequencyChart && (
                            <View style={{ marginTop: 12, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Text style={{ color: '#1F2937', fontSize: 12, fontFamily: 'Inter-SemiBold' }}>
                                  Symptom Frequency Analysis
                                </Text>
                                <TouchableOpacity onPress={() => setShowFrequencyChart(false)} style={{ padding: 2 }}>
                                  <Text style={{ color: '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 16 }}>×</Text>
                                </TouchableOpacity>
                              </View>
                              {Object.entries(symptomFrequency)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([symptom, count]) => {
                                  const maxCount = Math.max(...Object.values(symptomFrequency));
                                  const percentage = (count / maxCount) * 100;
                                  const barColor = count >= 4 ? '#DC2626' : count >= 2 ? '#F59E0B' : '#3B82F6';
                                  
                                  return (
                                    <View key={symptom} style={{ marginBottom: 6 }}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <Text style={{ fontSize: 10, fontFamily: 'Inter-Medium', color: '#374151' }}>
                                          {symptom}
                                        </Text>
                                        <Text style={{ fontSize: 10, fontFamily: 'Inter-SemiBold', color: barColor }}>
                                          {count}x
                                        </Text>
                                      </View>
                                      <View style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                                        <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: barColor, borderRadius: 2 }} />
                                      </View>
                                    </View>
                                  );
                                })}
                            </View>
                          )}
                          
                          {/* Important Note */}
                          <View style={{ marginTop: 12, padding: 10, backgroundColor: '#FEF3C7', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Inter-SemiBold', color: '#92400E', marginBottom: 3 }}>
                              ⚠️ Important Note
                            </Text>
                            <Text style={{ fontSize: 9, fontFamily: 'Inter-Medium', color: '#92400E', lineHeight: 13 }}>
                              This is a guide based on symptom patterns. Always consult a licensed healthcare provider for proper diagnosis and treatment.
                            </Text>
                          </View>
                        </View>
                      )}
                      
                      {msg.confidence !== undefined && !msg.diseases && (
                        <View style={{ 
                          marginTop: 10,
                          paddingTop: 10,
                          borderTopWidth: 1,
                          borderTopColor: '#E5E7EB',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TrendingUp size={14} color={getConfidenceColor(msg.confidence)} />
                            <Text style={{ 
                              fontSize: 11, 
                              fontFamily: 'Inter-SemiBold',
                              color: '#6B7280',
                              marginLeft: 4
                            }}>
                              Confidence Level
                            </Text>
                          </View>
                          <View style={{ 
                            backgroundColor: getConfidenceColor(msg.confidence) + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6
                          }}>
                            <Text style={{ 
                              color: getConfidenceColor(msg.confidence),
                              fontSize: 11,
                              fontFamily: 'Inter-SemiBold'
                            }}>
                              {msg.confidence}%
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>
          ))}
          {loading && (
            <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ 
                backgroundColor: 'white',
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 16,
                borderBottomLeftRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                <ActivityIndicator size="small" color="#20A0D8" />
                <Text style={{ color: '#6B7280', fontSize: 13, fontFamily: 'Inter-Medium' }}>
                  Analyzing...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={{ 
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 4
          }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Describe your symptoms..."
              placeholderTextColor="#9CA3AF"
              style={{ 
                flex: 1,
                fontSize: 14,
                fontFamily: 'Inter-Medium',
                color: '#1F2937',
                paddingVertical: 10,
                maxHeight: 100
              }}
              multiline
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{ 
                backgroundColor: input.trim() && !loading ? '#1B365D' : '#D1D5DB',
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8
              }}
            >
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};
