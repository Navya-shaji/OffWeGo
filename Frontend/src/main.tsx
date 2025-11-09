import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { onMessageListener, requestForToken } from "./Firebase/firebase";


const CLIENT_ID =
  "486377046092-u6cngi8odi8ae7b5tc6jms049v9a70mo.apps.googleusercontent.com";

// Optional wrapper component to handle Firebase setup
// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  useEffect(() => {
    // ✅ Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch((err) => console.error("Service Worker registration failed:", err));
    }

    // ✅ Request FCM token
    requestForToken();

    // ✅ Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log("Foreground notification received:", payload);
        alert(`${payload.notification?.title} - ${payload.notification?.body}`);
      })
      .catch((err) => console.error("FCM listener failed:", err));
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Root />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
