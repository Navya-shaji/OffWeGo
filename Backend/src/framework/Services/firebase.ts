import admin from "firebase-admin";

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountEnv) {
  console.error("FIREBASE_SERVICE_ACCOUNT environment variable is not set!");
} else {
  try {
    let serviceAccount: admin.ServiceAccount;

    // Check if it's Base64 encoded
    if (serviceAccountEnv.startsWith("{")) {
      serviceAccount = JSON.parse(serviceAccountEnv);
    } else {
      const decoded = Buffer.from(serviceAccountEnv, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    }

    // Fix private key formatting (newlines are often escaped in env vars)
    interface GoogleServiceAccount extends admin.ServiceAccount {
      private_key?: string;
    }

    const sa = serviceAccount as GoogleServiceAccount;
    if (sa.private_key) {
      sa.private_key = sa.private_key.replace(/\\n/g, "\n");
      sa.privateKey = sa.private_key; // Sync with the standard field if needed
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
  }
}

export const firebaseAdmin = admin;
