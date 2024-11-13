import { initializeApp, getApps } from "firebase/app";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


let firebaseApp = getApps().find(app => app.name === 'default')

if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig, 'default');
}

export async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log("Service Worker registered with scope:", registration.scope);

      const readyRegistration = await navigator.serviceWorker.ready;

      const messaging = getMessaging(firebaseApp);
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: readyRegistration,
      });

      if (currentToken) {
        console.log("current token for client: ", currentToken);
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { token: currentToken });
          console.log("Token successfully saved to Firestore.");
        } else {
          console.error("No user is logged in.");
        }
      } else {
        console.error("No registration token available. Request permission to generate one.");
      }
    } else {
      console.error("Unable to get permission to notify.");
    }
  } catch (error) {
    console.error("Error in requestPermission:", error);
  }
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
