import admin from "firebase-admin";

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountEnv) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT environment variable is not set!");
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
    if (serviceAccount && (serviceAccount as any).private_key) {
      (serviceAccount as any).private_key = (serviceAccount as any).private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
  }
}

export const firebaseAdmin = admin;
