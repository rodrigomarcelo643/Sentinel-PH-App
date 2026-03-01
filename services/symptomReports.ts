import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SymptomReport {
  id: string;
  barangay: string;
  createdAt: any;
  customSymptom: string;
  description: string;
  latitude: number;
  location: string;
  longitude: number;
  proofImageUrl: string;
  reportType: 'observed' | 'experienced';
  status: 'pending' | 'verified' | 'rejected';
  symptoms: string[];
  userId: string;
  userName: string;
}

export const subscribeToSymptomReports = (callback: (reports: SymptomReport[]) => void) => {
  const q = query(collection(db, 'symptomReports'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SymptomReport[];
    callback(reports);
  });
};

export const getSymptomReports = async (): Promise<SymptomReport[]> => {
  const q = query(collection(db, 'symptomReports'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SymptomReport[];
};