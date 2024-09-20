"use client";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import React from "react";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import CardContainer from "../components/CardContainer";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  nickname: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: number;
  photoURL: string;
}

const AccountPage = () => {
  const router = useRouter();
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
      <CardContainer>
        <div className="flex justify-between items-center text-2xl text-textbrawnlight font-bold mb-0 font-serif border-b border-mainpinklight border-dashed pb-4 w-full">
          <div className='w-2/5'></div>
          <div className='flex justify-center w-full'>
            PROFILE
          </div>
          <div className='w-2/5 flex justify-between items-center'>
            <button onClick={() => router.push('/profile')} className="h-full rounded-lg text-base">
              編集
            </button>
            <div className="bg-mainpink h-fullbg-mainpink h-7 flex items-center w-7 justify-center rounded-2xl">
              <img src='/editicon.png' alt='edit icon' className='' />
            </div>
          </div>
        </div>
        <div className="text-center">
          {userData?.nickname && (
            <p className="text-lg font-serif text-textbrawnlight mb-1 w-72">
              {userData.nickname}
            </p>
          )}
          {userData?.birthYear && userData.birthMonth && userData.birthDay && (
            <p className="text-md font-serif text-textbrawnlight mb-4">
              {userData.birthYear}/{userData.birthMonth}/{userData.birthDay}
            </p>
          )}
          {userData?.photoURL ? (
            <div className="flex justify-center">
              <Image
                src={userData.photoURL}
                alt="Profile Image"
                width={180}
                height={180}
                className="rounded-lg object-cover bg-gray-100"
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-gray-200 rounded-lg mx-auto"></div>
          )}
        </div>
      </CardContainer>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;
