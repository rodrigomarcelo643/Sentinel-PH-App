import { collection, doc, setDoc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SymptomReport } from './symptomReports';

export interface UserQRCode {
  qrId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  userData: any;
  symptomReports: SymptomReport[];
}

const generateQRId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `QR-${timestamp}-${randomStr}`.toUpperCase();
};

const getUserSymptomReports = async (userId: string): Promise<SymptomReport[]> => {
  try {
    const reportsQuery = query(
      collection(db, 'symptomReports'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(reportsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt?.toDate() || new Date(),
    })) as SymptomReport[];
  } catch (error) {
    console.error('Error fetching symptom reports:', error);
    return [];
  }
};

export const generateUserQRCode = async (userId: string, userData: any): Promise<UserQRCode | null> => {
  try {
    if (!userData) {
      throw new Error('User data not provided');
    }

    const symptomReports = await getUserSymptomReports(userId);

    const existingQRQuery = query(
      collection(db, 'userQRCodes'),
      where('userId', '==', userId)
    );
    const existingQRSnapshot = await getDocs(existingQRQuery);

    let qrId: string;
    let qrDocRef;

    if (!existingQRSnapshot.empty) {
      const existingDoc = existingQRSnapshot.docs[0];
      qrId = existingDoc.data().qrId;
      qrDocRef = doc(db, 'userQRCodes', existingDoc.id);
    } else {
      qrId = generateQRId();
      qrDocRef = doc(collection(db, 'userQRCodes'));
    }

    const qrCodeData: UserQRCode = {
      qrId,
      userId,
      createdAt: existingQRSnapshot.empty ? new Date() : existingQRSnapshot.docs[0].data().createdAt.toDate(),
      updatedAt: new Date(),
      userData,
      symptomReports,
    };

    await setDoc(qrDocRef, qrCodeData);
    return qrCodeData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

// Get existing QR code for user
export const getUserQRCode = async (userId: string): Promise<UserQRCode | null> => {
  try {
    const qrQuery = query(
      collection(db, 'userQRCodes'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(qrQuery);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserQRCode;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return null;
  }
};

export const getQRCodeData = async (qrId: string): Promise<UserQRCode | null> => {
  try {
    const qrQuery = query(
      collection(db, 'userQRCodes'),
      where('qrId', '==', qrId)
    );
    const querySnapshot = await getDocs(qrQuery);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserQRCode;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching QR code data:', error);
    return null;
  }
};