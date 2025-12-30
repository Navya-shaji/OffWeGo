# Admin Notification System

A comprehensive Firebase Cloud Messaging (FCM) based notification system for the admin dashboard.

## Features

- **Real-time Notifications**: Firebase Cloud Messaging for instant delivery
- **Multiple Event Types**: Booking, Payment, Subscription, Wallet transactions
- **Database Storage**: Persistent notification storage with read/unread status
- **Interactive UI**: Bell icon with unread count, expandable notification panel
- **Type-safe**: Full TypeScript support with proper interfaces
- **Responsive Design**: Mobile-friendly notification panel
- **Action Handling**: Click-to-navigate functionality for different notification types

## Components

### 1. NotificationBell
- Bell icon with unread count badge
- Animated pulse effect for new notifications
- Active state indicator when panel is open

### 2. NotificationPanel
- Slide-out panel with all notifications
- Mark as read/unread functionality
- Delete individual notifications
- Mark all as read option
- Time-based formatting (just now, 5m ago, etc.)

### 3. useNotifications Hook
- Manages notification state
- Handles FCM initialization
- Real-time updates
- API integration

### 4. NotificationService
- API calls for CRUD operations
- FCM token management
- Notification triggers for different events

## Setup

### 1. Environment Variables
Add these to your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

### 2. Firebase Setup
1. Create a Firebase project
2. Enable Cloud Messaging
3. Generate a VAPID key pair
4. Add Firebase config to environment variables

### 3. Backend API Endpoints
Your backend should implement these endpoints:

```typescript
GET /api/admin/notifications          // Get notifications with pagination
GET /api/admin/notifications/count     // Get unread/total counts
PATCH /api/admin/notifications/:id/read // Mark notification as read
PATCH /api/admin/notifications/read-all // Mark all as read
DELETE /api/admin/notifications/:id    // Delete notification
POST /api/admin/fcm-token             // Update FCM token
POST /api/admin/send-notification     // Send notification to user
```

## Usage

### Basic Integration
```tsx
import { NotificationBell, NotificationPanel, useNotifications } from '@/components/Notifications';

function AdminDashboard() {
  const { isOpen, toggleNotifications } = useNotifications();

  return (
    <div>
      <header>
        <NotificationBell />
      </header>
      
      <NotificationPanel 
        isOpen={isOpen} 
        onClose={toggleNotifications} 
      />
    </div>
  );
}
```

### Triggering Notifications
```tsx
import { notificationTriggers } from '@/components/Notifications';

// Booking notification
await notificationTriggers.bookingNotification({
  userName: 'John Doe',
  destination: 'Paris',
  amount: 299,
  bookingId: 'booking_123',
  adminFCMToken: 'token_here'
});

// Payment notification
await notificationTriggers.paymentNotification({
  userName: 'John Doe',
  amount: 299,
  paymentId: 'payment_123',
  adminFCMToken: 'token_here'
});
```

## Notification Types

### Booking
- Trigger: New booking created
- Icon: Calendar
- Color: Blue
- Data: bookingId, userId, amount

### Payment
- Trigger: Payment received
- Icon: Credit Card
- Color: Green
- Data: paymentId, userId, amount

### Subscription
- Trigger: Subscription purchased
- Icon: Shopping Bag
- Color: Purple
- Data: subscriptionId, userId, plan, amount

### Wallet
- Trigger: Wallet transaction
- Icon: Wallet
- Color: Orange
- Data: transactionId, userId, amount, transactionType

### System
- Trigger: General system notifications
- Icon: Info
- Color: Gray
- Data: varies

## Database Schema

```typescript
interface Notification {
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
    [key: string]: any;
  };
}
```

## Advanced Features

### Custom Notification Handling
```tsx
const { notifications } = useNotifications();

// Listen for new notifications
useEffect(() => {
  const handleNewNotification = (event: CustomEvent) => {
    const notification = event.detail;
    // Custom handling logic
  };

  window.addEventListener('newNotification', handleNewNotification);
  return () => window.removeEventListener('newNotification', handleNewNotification);
}, []);
```

### Custom Styling
The components use Tailwind CSS classes that can be easily customized:

```css
/* Override notification badge */
.notification-badge {
  @apply bg-red-500 text-white;
}

/* Custom panel animation */
.notification-panel {
  @apply transform transition-transform duration-300;
}
```

## Troubleshooting

### FCM Not Working
1. Check Firebase configuration
2. Verify VAPID key is set
3. Ensure service worker is registered
4. Check browser notification permissions

### Notifications Not Showing
1. Check API endpoints are working
2. Verify FCM token is saved in database
3. Check browser console for errors
4. Ensure user has granted notification permission

### Performance Issues
1. Implement pagination for large notification lists
2. Use debouncing for search/filter operations
3. Optimize re-renders with proper dependencies

## Security Considerations

1. **FCM Tokens**: Store tokens securely and validate them
2. **API Authentication**: Protect notification endpoints with admin authentication
3. **Data Validation**: Validate all notification data before processing
4. **Rate Limiting**: Implement rate limiting for notification sends

## Browser Support

- Chrome 50+
- Firefox 44+
- Safari 11+
- Edge 79+

## Dependencies

- Firebase Cloud Messaging
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
