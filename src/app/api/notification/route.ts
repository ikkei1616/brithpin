import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Firebase Admin SDKの初期化
const serviceAccount = require("/firebaseSecretKey.json");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export async function GET(req: NextRequest) {
  try {
    // Firestoreからユーザー情報を取得
    const usersSnapshot = await db.collection("users").get();
    const usersData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // データをレスポンスとして返す
    return NextResponse.json({ users: usersData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}