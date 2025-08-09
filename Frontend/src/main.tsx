import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
const CLIENT_ID =
  "486377046092-u6cngi8odi8ae7b5tc6jms049v9a70mo.apps.googleusercontent.com";

import { PersistGate } from "redux-persist/integration/react";
import { setInterceptors } from "./axios/Interceptors.ts";

setInterceptors();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
