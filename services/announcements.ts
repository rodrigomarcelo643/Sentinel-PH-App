import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, getDoc, Firestore } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'health_advisory' | 'outbreak_alert' | 'medical_supplies' | 'water_advisory' | 'vaccination_drive' | 'other';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Announcement[];
    callback(announcements);
  });
};

export const markAnnouncementAsRead = async (userId: string, announcementId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    readAnnouncements: arrayUnion(announcementId)
  });
};

export const getUserReadAnnouncements = async (userId: string): Promise<string[]> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.data()?.readAnnouncements || [];
};
