import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

import { SocketProvider } from "./utilities/socket";
import { ChatProvider } from '@/context/chatContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const CLIENT_ID =
  "486377046092-u6cngi8odi8ae7b5tc6jms049v9a70mo.apps.googleusercontent.com";


// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  return <App />;
}

const queryClient = new QueryClient();


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration.scope);
    })
    .catch((err) =>
      console.error("Service Worker registration failed:", err)
    );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <ChatProvider>
                <Root />
                <Toaster position="top-center" />
              </ChatProvider>
            </SocketProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);