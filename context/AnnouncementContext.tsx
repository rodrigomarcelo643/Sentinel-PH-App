import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement, subscribeToAnnouncements, getUserReadAnnouncements, markAnnouncementAsRead } from '../services/announcements';
import { useAuth } from './AuthContext';

interface AnnouncementContextType {
  announcements: Announcement[];
  unreadCount: number;
  readAnnouncements: string[];
  markAsRead: (announcementId: string) => Promise<void>;
  latestAnnouncement: Announcement | null;
  showNotification: boolean;
  closeNotification: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readAnnouncements, setReadAnnouncements] = useState<string[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    getUserReadAnnouncements(user.uid).then(setReadAnnouncements);

    const unsubscribe = subscribeToAnnouncements((newAnnouncements) => {
      console.log('New announcements received:', newAnnouncements.length);
      
      if (newAnnouncements.length > 0) {
        const newest = newAnnouncements[0];
        console.log('Newest announcement:', newest.id, newest.title);
        
        // Always show notification for the first load or when there's a new announcement
        if (announcements.length === 0 || (announcements.length > 0 && newest.id !== announcements[0]?.id)) {
          console.log('Showing notification for:', newest.title);
          setLatestAnnouncement(newest);
          setShowNotification(true);
          
          // Auto-close after 30 seconds
          setTimeout(() => {
            console.log('Auto-closing notification');
            setShowNotification(false);
            setTimeout(() => setLatestAnnouncement(null), 300);
          }, 30000);
        }
      }
      setAnnouncements(newAnnouncements);
    });

    return unsubscribe;
  }, [user?.uid, announcements.length]);

  const closeNotification = () => {
    console.log('Closing notification');
    setShowNotification(false);
    setTimeout(() => setLatestAnnouncement(null), 300);
  };

  const markAsRead = async (announcementId: string) => {
    if (!user?.uid) return;
    await markAnnouncementAsRead(user.uid, announcementId);
    setReadAnnouncements(prev => [...prev, announcementId]);
  };

  const unreadCount = Math.min(announcements.filter(a => !readAnnouncements.includes(a.id)).length, 99);

  return (
    <AnnouncementContext.Provider value={{ 
      announcements, 
      unreadCount, 
      readAnnouncements, 
      markAsRead, 
      latestAnnouncement, 
      showNotification,
      closeNotification
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) throw new Error('useAnnouncements must be used within AnnouncementProvider');
  return context;
};
