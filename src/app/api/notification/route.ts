import { NextResponse } from "next/server";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { FirebaseError } from "firebase-admin";
import { getApps } from "firebase-admin/app";
require('dotenv').config();

interface User {
  id: string;
  nickname: string;
  friends?: string[];
  birthMonth?: number;
  birthDay?: number;
  friendsDetails?: FriendDetail[];
  token?: string;
}

interface FriendDetail {
  id: string;
  nickname: string;
  birthMonth?: number;
  birthDay?: number;
}

let firebaseApp = getApps().find(app => app.name === 'notification')

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

if (!firebaseApp) {
  firebaseApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, 'notification');
}

const db = getFirestore(firebaseApp);

export async function GET() {
  try {
    const today = new Date();
    const hundredDaysLater = new Date();
    hundredDaysLater.setDate(today.getDate() + 10);

    const usersSnapshot = await db.collection("users").get();
    let usersData: User[] = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      nickname: doc.data().nickname,
      friends: doc.data().friends || [],
      birthMonth: doc.data().birthMonth,
      birthDay: doc.data().birthDay,
      token: doc.data().token,
    }));

    usersData = usersData.filter(user => user.friends && user.friends.length > 0 && user.token);

    for (const user of usersData) {
      if (user.token) {
        const friendsSnapshot = await db.collection("users")
          .where('__name__', 'in', user.friends)
          .get();

        const birthdayFriends = friendsSnapshot.docs.filter(friendDoc => {
          const friendData = friendDoc.data();
          const friendBirthdayThisYear = new Date(today.getFullYear(), friendData.birthMonth - 1, friendData.birthDay);

          if (friendBirthdayThisYear >= today && friendBirthdayThisYear <= hundredDaysLater) {
            return true;
          }

          const friendBirthdayNextYear = new Date(today.getFullYear() + 1, friendData.birthMonth - 1, friendData.birthDay);
          return friendBirthdayNextYear >= today && friendBirthdayNextYear <= hundredDaysLater;
        });

        if (birthdayFriends.length > 0) {
          const messaging = getMessaging(firebaseApp);

          const message = {
            data: {
              title: "友人の誕生日が近いています！",
              body: `${birthdayFriends.map(friendDoc => friendDoc.data().nickname).join(", ")}の誕生日が近づいています！`,
              tag: "birthday-notification",
              icon: `${birthdayFriends[0].data().photoURL}`,
            },
            token: user.token,
          };

          try {
            const response = await messaging.send(message);
            console.log(`Message sent successfully to ${user.nickname}:`, response);
          } catch (error: unknown) {
            const firebaseError = error as FirebaseError;
            
            if (firebaseError.code === 'messaging/registration-token-not-registered') {
              console.error(`Token for ${user.nickname} is invalid or unregistered. Skipping.`);
            } else {
              console.error(`Failed to send message to ${user.nickname}:`, firebaseError);
            }
          }
        }
      }
    }

    return NextResponse.json({ message: "Notifications sent" });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
