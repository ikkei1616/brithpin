"use client";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import React from "react";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

interface User {
  nickname: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: number;
  photoURL: string;
}

const AccountPage = () => {
  const [userData, setUserData] = useState<User | undefined>(undefined);

  const getDocData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docSnapData = docSnap.data();
      const formatUserData: User = {
        nickname: docSnapData.nickname,
        birthDay: docSnapData.birthDay,
        birthMonth: docSnapData.birthMonth,
        birthYear: docSnapData.birthYear,
        gender: docSnapData.gender,
        photoURL: docSnapData.photoURL,
      };
      setUserData(formatUserData);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    // Firebase認証状態を監視
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // ユーザーが認証されている場合にデータを取得
        getDocData(user.uid);
      } else {
        console.log("あいあい居合: ユーザーが認証されていません");
      }
    });

    return () => unsubscribe(); // クリーンアップのために監視を解除
  }, []);

  return (
    <div className="h-screen flex items-center justify-center pt-6">
      <div>
        <p>{userData?.nickname}</p>
        <p>{userData?.birthYear}</p>
        <p>{userData?.birthMonth}</p>
        <p>{userData?.birthDay}</p>
        <p>{userData?.gender}</p>
        <p>{userData?.photoURL}</p>
      </div>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;
