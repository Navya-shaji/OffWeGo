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

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BMdRY7kU2uSCfpQXaXeNKq-di7QF_cJtk6hAquJvBEzo7IPNigurnO36a7qV5114LzjmOWs_rzQoJ7uE9Lxi_XA"
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available.");
      return null;
    }

  } catch (err) {
    console.error("Error retrieving FCM token:", err);
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

export default app;
