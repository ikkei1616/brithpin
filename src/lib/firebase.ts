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

export function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      }).then((currentToken) => {
        if (currentToken) {
          console.log("current token for client: ", currentToken);
          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            updateDoc(userDocRef, { token: currentToken })
              .then(() => {
                console.log("Token successfully saved to Firestore.");
              })
              .catch((error) => {
                console.error("Error saving token to Firestore: ", error);
              });
          } else {
            console.error("No user is logged in.");
          }
        } else {
          console.error(
            "No registration token available. Request permission to generate one."
          );
        }
      });
    } else {
      console.error("Unable to get permission to notify.");
    }
  });
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
