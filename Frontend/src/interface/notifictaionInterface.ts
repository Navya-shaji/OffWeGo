export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'subscription' | 'wallet' | 'system';
  isRead: boolean;
  createdAt: string;
  data?: {
    bookingId?: string;
    paymentId?: string;
    subscriptionId?: string;
    transactionId?: string;
    amount?: number;
    userId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface NotificationCount {
  unreadCount: number;
  totalCount: number;
}

export interface FCMMessage {
  to: string;
  notification: {
    title: string;
    body: string;
    icon?: string;
    click_action?: string;
  };
  data?: {
    type: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  priority?: 'high' | 'normal';
}
