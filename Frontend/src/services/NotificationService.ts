import axiosInstance from "@/axios/instance";
import type { FCMMessage, NotificationCount } from "@/interface/notifictaionInterface";

// API Service for notifications
export const notificationService = {
  // Get all notifications for admin
  getNotifications: async (page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
    totalPages: number;
  }> => {
    const response = await axiosInstance.get("/api/admin/notifications", {
      params: { page, limit }
    });
    return response.data;
  },

  // Get notification count
  getNotificationCount: async (): Promise<NotificationCount> => {
    const response = await axiosInstance.get("/api/admin/notifications/count");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.patch(`/api/admin/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch("/api/admin/notifications/read-all");
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await axiosInstance.delete(`/api/admin/notifications/${notificationId}`);
  },

  // Update FCM token
  updateFCMToken: async (token: string): Promise<void> => {
    await axiosInstance.post("/api/admin/fcm-token", { token });
  },

  // Send notification to specific user (admin function)
  sendNotification: async (message: FCMMessage): Promise<void> => {
    await axiosInstance.post("/api/admin/send-notification", message);
  }
};

// FCM Service for Firebase Cloud Messaging
export class FCMService {
  private static instance: FCMService;
  private messaging: any = null;
  private token: string | null = null;

  static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  // Initialize Firebase Messaging
  async initialize(): Promise<void> {
    try {
      // Import Firebase dynamically to avoid SSR issues
      const { getMessaging } = await import('firebase/messaging');
      const { initializeApp } = await import('firebase/app');

      // Firebase config (should be in environment variables)
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);

      // Request permission and get token
      await this.requestPermission();
      
      // Setup foreground message handler
      this.setupMessageHandler();
      
    } catch (error) {
      console.error('FCM initialization failed:', error);
    }
  }

  // Request notification permission
  async requestPermission(): Promise<string | null> {
    try {
      const { getToken } = await import('firebase/messaging');
      
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.token = await getToken(this.messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        
        if (this.token) {
          // Send token to backend
          await notificationService.updateFCMToken(this.token);
        }
        return this.token;
      } else {
        console.warn('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return null;
    }
  }

  private setupMessageHandler(): void {
    try {
      const onMessage = require('firebase/messaging').onMessage;
      
      onMessage(this.messaging, (payload: any) => {
        
        this.handleForegroundMessage(payload);
      });
    } catch (error) {
      console.error('Error setting up message handler:', error);
    }
  }

  private handleForegroundMessage(payload: any): void {
    const { notification, data } = payload;
    
    
    if (Notification.permission === 'granted') {
      new Notification(notification?.title || 'New Notification', {
        body: notification?.body || '',
        icon: '/favicon.ico',
        tag: data?.type || 'general',
        requireInteraction: true,
      });
    }

    window.dispatchEvent(new CustomEvent('newNotification', {
      detail: {
        title: notification?.title,
        body: notification?.body,
        data: data,
        timestamp: new Date().toISOString(),
      }
    }));
  }


  getToken(): string | null {
    return this.token;
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }
}

export const notificationTriggers = {
  bookingNotification: async (bookingData: any): Promise<void> => {
    const message: FCMMessage = {
      to: bookingData.adminFCMToken || '/topics/admin',
      notification: {
        title: 'New Booking Received',
        body: `New booking from ${bookingData.userName} for ${bookingData.destination}`,
        icon: '/icons/booking-icon.png',
      },
      data: {
        type: 'booking',
        bookingId: bookingData.id,
        userId: bookingData.userId,
        amount: bookingData.amount?.toString(),
      },
      priority: 'high',
    };

    await notificationService.sendNotification(message);
  },


  paymentNotification: async (paymentData: any): Promise<void> => {
    const message: FCMMessage = {
      to: paymentData.adminFCMToken || '/topics/admin',
      notification: {
        title: 'Payment Received',
        body: `Payment of $${paymentData.amount} received from ${paymentData.userName}`,
        icon: '/icons/payment-icon.png',
      },
      data: {
        type: 'payment',
        paymentId: paymentData.id,
        userId: paymentData.userId,
        amount: paymentData.amount.toString(),
      },
      priority: 'high',
    };

    await notificationService.sendNotification(message);
  },

 
  subscriptionNotification: async (subscriptionData: any): Promise<void> => {
    const message: FCMMessage = {
      to: subscriptionData.adminFCMToken || '/topics/admin',
      notification: {
        title: 'New Subscription',
        body: `${subscriptionData.userName} subscribed to ${subscriptionData.plan}`,
        icon: '/icons/subscription-icon.png',
      },
      data: {
        type: 'subscription',
        subscriptionId: subscriptionData.id,
        userId: subscriptionData.userId,
        plan: subscriptionData.plan,
        amount: subscriptionData.amount?.toString(),
      },
      priority: 'high',
    };

    await notificationService.sendNotification(message);
  },

  walletNotification: async (transactionData: any): Promise<void> => {
    const isCredit = transactionData.type === 'credit';
    const message: FCMMessage = {
      to: transactionData.adminFCMToken || '/topics/admin',
      notification: {
        title: isCredit ? 'Wallet Credit' : 'Wallet Debit',
        body: `${transactionData.userName} ${isCredit ? 'credited' : 'debited'} $${transactionData.amount} ${isCredit ? 'to' : 'from'} wallet`,
        icon: '/icons/wallet-icon.png',
      },
      data: {
        type: 'wallet',
        transactionId: transactionData.id,
        userId: transactionData.userId,
        amount: transactionData.amount.toString(),
        transactionType: transactionData.type,
      },
      priority: 'high',
    };

    await notificationService.sendNotification(message);
  },
};
