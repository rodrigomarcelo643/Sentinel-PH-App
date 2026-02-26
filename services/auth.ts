import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserData {
  uid: string;
  email: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  communityRole?: string;
  address: {
    region: string;
    municipality: string;
    barangay: string;
  };
  documents: {
    idType: string;
    validIdUrl: string;
    selfieUrl: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export const loginWithContactNumber = async (contactNumber: string, password: string): Promise<UserData> => {
  const formattedPhone = `0${contactNumber}`;
  
  try {
    // Find user by contact number
    const q = query(collection(db, 'users'), where('contactNumber', '==', formattedPhone));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) throw new Error('User not found');
    
    const userData = snapshot.docs[0].data() as UserData;
    
    // Login with email
    await signInWithEmailAndPassword(auth, userData.email, password);
    
    return userData;
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message.includes('backend')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};
