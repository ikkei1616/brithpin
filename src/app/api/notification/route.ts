import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// User型の定義
interface User {
  id: string;
  nickname: string;
  friends?: string[]; // フレンドのIDの配列
  birthMonth?: number;
  birthDay?: number;
  friendsDetails?: FriendDetail[]; // フレンドの詳細情報の配列
}

// FriendDetail型の定義
interface FriendDetail {
  id: string;
  nickname: string;
  birthMonth?: number;
  birthDay?: number;
}

// Firebase Admin SDKの初期化
const serviceAccount = require("/firebaseSecretKey.json");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export async function GET(req: NextRequest) {
  try {
    // Firestoreから全ユーザー情報を取得
    const usersSnapshot = await db.collection("users").get();
    let usersData: User[] = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      nickname: doc.data().nickname,
      friends: doc.data().friends || [],
      birthMonth: doc.data().birthMonth,
      birthDay: doc.data().birthDay,
    }));

    // 各ユーザーのフレンド情報を取得
    for (const user of usersData) {
      if (user.friends && user.friends.length > 0) {
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
      } else {
        user.friendsDetails = [];
      }
    }

    // friendsDetailsが空でないユーザーのみをフィルタリング
    usersData = usersData.filter(user => user.friendsDetails && user.friendsDetails.length > 0);

    // データをレスポンスとして返す
    return NextResponse.json({ users: usersData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
