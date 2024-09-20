import { NextResponse } from "next/server";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getApps } from "firebase-admin/app";
require('dotenv').config();


// User型の定義
interface User {
  id: string;
  nickname: string;
  friends?: string[];
  birthMonth?: number;
  birthDay?: number;
  friendsDetails?: FriendDetail[]; // フレンドの詳細情報の配列
  token?: string; // ユーザーのトークン
}

// FriendDetail型の定義
interface FriendDetail {
  id: string;
  nickname: string;
  birthMonth?: number;
  birthDay?: number;
}

// Firebase Admin SDKの初期化
// const serviceAccount = require("/firebaseSecretKey.json");
// console.log(serviceAccount);
let firebaseApp = getApps().find(app => app.name === 'notification')

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID',projectId);
const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
console.log('NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL',clientEmail);
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
console.log('NEXT_PUBLIC_PRIVATE_KEY',privateKey);


if (!firebaseApp) {
  console.log('initializeApp');
  firebaseApp = initializeApp({
    // credential: cert(serviceAccount),
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, 'notification'); // 新しいアプリを初期化
}

const db = getFirestore(firebaseApp);

export async function GET() {
  try {
    // トークンの配列（友人がいるユーザーのトークンを保持）
    let registrationTokens: string[] = [];

    // Firestoreから全ユーザー情報を取得
    const usersSnapshot = await db.collection("users").get();
    let usersData: User[] = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      nickname: doc.data().nickname,
      friends: doc.data().friends || [],
      birthMonth: doc.data().birthMonth,
      birthDay: doc.data().birthDay,
      token: doc.data().token, // ユーザーのトークンを取得
    }));

    // friendsが存在するユーザーのみをフィルタリング
    usersData = usersData.filter(user => user.friends && user.friends.length > 0);

    // 各ユーザーのフレンド情報を取得
    for (const user of usersData) {
      // フレンドのIDからフレンド情報を取得
      const friendsSnapshot = await db.collection("users")
        .where('__name__', 'in', user.friends)
        .get();

      // フレンド情報の抽出
      user.friendsDetails = friendsSnapshot.docs.map(friendDoc => ({
        id: friendDoc.id,
        nickname: friendDoc.data().nickname,
        birthDay: friendDoc.data().birthDay,
        birthMonth: friendDoc.data().birthMonth,
      }));

      // 友人がいるユーザーのトークンをtoken配列に追加
      if (user.token) {
        registrationTokens.push(user.token);
      }
    }
    console.log(registrationTokens);
    // フラットにして重複を排除
    registrationTokens = [...new Set(registrationTokens.flat())];

    if (registrationTokens.length > 0) {
      const messaging = getMessaging(firebaseApp);
      const message = {
        notification: {
          title: 'お知らせ',
          body: 'あなたの友人の誕生日が近づいています！',
        },
        tokens: registrationTokens,
      };

      // メッセージの送信
      const response = await messaging.sendEachForMulticast(message);
      console.log(response.successCount + ' messages were sent successfully');
    }

    // データをレスポンスとして返す
    return NextResponse.json({ users: usersData, tokens: registrationTokens });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
