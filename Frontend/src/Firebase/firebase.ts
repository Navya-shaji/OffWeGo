import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGCq4_BV4UFDc33Y0VczBpy4Rk3jdlbLA",
  authDomain: "offwego-ce44e.firebaseapp.com",
  projectId: "offwego-ce44e",
  storageBucket: "offwego-ce44e.firebasestorage.app",
  messagingSenderId: "133283743627",
  appId: "1:133283743627:web:b167415a23e74d68ed518e",
  measurementId: "G-947WFFG3SR"
};

const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

export { messaging };

export const getFcmToken = async (): Promise<string | null> => {
  try {
    // Request notification permission if not already granted
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn("⚠️ Notification permission not granted");
          return null;
        }
      } else if (Notification.permission === 'denied') {
        console.warn("⚠️ Notification permission denied");
        return null;
      }
    }

    const token = await getToken(messaging, {
      vapidKey: "BMdRY7kU2uSCfpQXaXeNKq-di7QF_cJtk6hAquJvBEzo7IPNigurnO36a7qV5114LzjmOWs_rzQoJ7uE9Lxi_XA"
    });

    if (token) {
      console.log("✅ FCM Token obtained:", token.substring(0, 20) + '...');
      return token;
    } else {
      console.log("⚠️ No registration token available.");
      return null;
    }

  } catch (err: any) {
    console.error("❌ Error retrieving FCM token:", err);
    // Handle specific errors
    if (err.code === 'messaging/permission-blocked') {
      console.warn("⚠️ Notification permission is blocked");
    } else if (err.code === 'messaging/permission-default') {
      console.warn("⚠️ Notification permission is default");
    }
    return null;
  }
};


export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (error) {
      reject(error);
    }
  });



export const subscribeToTopic = async (token: string, topic: string) => {
  try {
    const response = await axios.post(
      `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`,
      {},
      {
        headers: {
          Authorization: "key=BMdRY7kU2uSCfpQXaXeNKq-di7QF_cJtk6hAquJvBEzo7IPNigurnO36a7qV5114LzjmOWs_rzQoJ7uE9Lxi_XA",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Subscribed to topic: ${topic}`, response.data);
  } catch (error) {
    console.error("Topic subscription failed:", error);
  }
};

export default app;
