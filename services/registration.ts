import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { uploadToCloudinary } from './cloudinary';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  contactNumber: string;
  email: string;
  region: string;
  municipality: string;
  barangay: string;
  communityRole: string;
  idType: string;
  validIdUri: string;
  selfieUri: string;
  password: string;
}

export const checkContactNumberExists = async (contactNumber: string): Promise<boolean> => {
  const formattedPhone = `0${contactNumber}`;
  const q = query(collection(db, 'users'), where('contactNumber', '==', formattedPhone));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const registerUser = async (data: RegistrationData) => {
  try {
    // Check if contact number already exists
    const exists = await checkContactNumberExists(data.contactNumber);
    if (exists) throw new Error('Contact number already registered');

    // Upload images to Cloudinary
    const [validIdUrl, selfieUrl] = await Promise.all([
      uploadToCloudinary(data.validIdUri),
      uploadToCloudinary(data.selfieUri),
    ]);

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Format phone number: 0 + 10 digits
    const formattedPhone = `0${data.contactNumber}`;

    // Save to Firestore
    await addDoc(collection(db, 'users'), {
      uid: userCredential.user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      middleInitial: data.middleInitial,
      contactNumber: formattedPhone,
      email: data.email,
      address: {
        region: data.region,
        municipality: data.municipality,
        barangay: data.barangay,
      },
      communityRole: data.communityRole,
      documents: {
        idType: data.idType,
        validIdUrl,
        selfieUrl,
      },
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message.includes('backend')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};
