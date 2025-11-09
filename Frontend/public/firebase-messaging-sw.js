
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBGCq4_BV4UFDc33Y0VczBpy4Rk3jdlbLA",
  authDomain: "offwego-ce44e.firebaseapp.com",
  projectId: "offwego-ce44e",
  storageBucket: "offwego-ce44e.firebasestorage.app",
  messagingSenderId: "133283743627",
  appId: "1:133283743627:web:b167415a23e74d68ed518e",
  measurementId: "G-947WFFG3SR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification?.title ?? "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
