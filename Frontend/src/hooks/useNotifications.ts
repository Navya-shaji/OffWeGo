import { notificationService,  FCMService } from '@/Notifications';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';


interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  loading: boolean;
  error: string;
  isOpen: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  toggleNotifications: () => void;
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fcmServiceRef = useRef<FCMService | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize FCM service
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        fcmServiceRef.current = FCMService.getInstance();
        if (fcmServiceRef.current.isSupported()) {
          await fcmServiceRef.current.initialize();
        }
      } catch (error) {
        console.error('Failed to initialize FCM:', error);
      }
    };

    initializeFCM();

    // Cleanup
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Listen for new notifications
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const notification = event.detail;
      
      // Show toast notification
      toast.info(notification.title, {
        icon: '/favicon.ico' as any,
      });

      // Update unread count
      setUnreadCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);

      // Add to notifications list if panel is open
      if (isOpen) {
        setNotifications(prev => [notification, ...prev]);
      }
    };

    window.addEventListener('newNotification', handleNewNotification as EventListener);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification as EventListener);
    };
  }, [isOpen]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (reset: boolean = false) => {
    if (loading) return;

    try {
      setLoading(true);
      setError('');

      const currentPage = reset ? 1 : page;
      const response = await notificationService.getNotifications(currentPage, 20);

      if (reset) {
        setNotifications(response.notifications);
        setPage(1);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }

      setUnreadCount(response.unreadCount);
      setTotalCount(response.totalCount);
      
      if (!reset) {
        setPage(currentPage + 1);
      }

    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchNotifications(true);

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      if (!isOpen) {
        // Only update counts when panel is closed
        updateNotificationCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, isOpen]);

  // Update notification count only
  const updateNotificationCount = useCallback(async () => {
    try {
      const count = await notificationService.getNotificationCount();
      setUnreadCount(count.unreadCount);
      setTotalCount(count.totalCount);
    } catch (error) {
      console.error('Failed to update notification count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('Failed to update notification');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setError('Failed to update notifications');
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      const notification = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setError('Failed to delete notification');
    }
  }, [notifications]);

  // Toggle notification panel
  const toggleNotifications = useCallback(async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      // Refresh notifications when opening
      await fetchNotifications(true);
    }
  }, [isOpen, fetchNotifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(true);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    error,
    isOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    toggleNotifications,
    refreshNotifications,
  };
}
